import { TopBar } from "@/components/ui/top-bar"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "./_components/profile-form"
import { SignOutButton } from "./_components/sign-out-button"
import { Mail, Phone, MapPin, LogOut, MessageSquare, Download } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  let user = null
  let profile = null

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      profile = profileData
    }
  } catch (error) {
    console.error('[v0] Profile page error:', error)
  }

  if (!user) {
    return (
      <>
        <TopBar title="Profile" showBack />
        <div className="px-4 pt-4">
          <p className="text-sm text-muted-foreground">Not signed in</p>
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="Profile" showBack />
      <div className="px-4 pt-4 flex flex-col gap-5">
        <section className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile?.full_name || "Profile"}
              className="size-16 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-serif text-2xl font-bold"
              aria-hidden="true"
            >
              {(profile?.full_name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-serif text-lg font-bold truncate">
              {profile?.full_name || "Your name"}
            </div>
            <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Mail className="size-3.5" aria-hidden="true" />
              <span className="truncate">{user?.email}</span>
            </div>
            {profile?.phone ? (
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                <Phone className="size-3.5" aria-hidden="true" />
                <span>{profile.phone}</span>
              </div>
            ) : null}
            {profile?.village || profile?.district ? (
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                <span>{[profile?.village, profile?.district, profile?.state].filter(Boolean).join(", ")}</span>
              </div>
            ) : null}
          </div>
        </section>

        <ProfileForm initial={profile} email={user?.email ?? ""} />

        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/contact"
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <span className="size-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <MessageSquare className="size-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-semibold text-sm">Contact us</div>
              <div className="text-[11px] text-muted-foreground">Help &amp; support</div>
            </div>
          </Link>
          <Link
            href="/download"
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <span className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Download className="size-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-semibold text-sm">Get the app</div>
              <div className="text-[11px] text-muted-foreground">Install on phone</div>
            </div>
          </Link>
        </section>

        <SignOutButton />
        <div className="text-center text-xs text-muted-foreground inline-flex items-center justify-center gap-1.5">
          <LogOut className="size-3.5" aria-hidden="true" />
          Signed in as {user?.email}
        </div>
      </div>
    </>
  )
}
