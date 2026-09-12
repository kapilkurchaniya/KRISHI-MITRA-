import { redirect } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Globe, ArrowRight, Shield, Verified } from "lucide-react"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f6fbf3] font-sans">
      {/* LEFT HERO VIEWPORT */}
      <div className="relative w-full lg:w-[56%] min-h-[480px] lg:min-h-screen bg-[#002d17] overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14442a] via-[#14442a]/70 to-[#14442a]/40 backdrop-blur-[1px]"></div>
        
        {/* Top Brand Header Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm">
              <span className="text-[#a3f69c] text-xl font-bold">AK</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none">AI Krishi</span>
              <span className="text-[10px] text-[#a3f69c] mt-1 tracking-widest font-bold uppercase">Agritech Intelligence</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#a3f69c] animate-pulse"></span>
            <span className="text-xs font-mono text-white/90">GEO-TELEMETRY: ACTIVE</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-4">
            <Globe className="w-4 h-4 text-[#a3f69c]" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Enterprise Onboarding</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Elevate your yields with predictive models.
          </h1>
          <p className="text-lg text-white/80 max-w-lg leading-relaxed">
            Join thousands of modern farm operators leveraging satellite hyperspectral data and AI to optimize resources and maximize crop output.
          </p>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-4">
          <div className="flex flex-col">
            <p className="text-[15px] text-white/90 italic">
              “Onboarding our 500-acre farm took minutes. The telemetry insights were immediate and transformative.”
            </p>
            <span className="text-[11px] font-bold text-[#a3f69c]/90 mt-1 tracking-wider uppercase">
              Anita Desai — Director, Green Acres Consortium
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL */}
      <div className="w-full lg:w-[44%] bg-[#f6fbf3] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#002d17] tracking-tight mb-2">Register your farm</h2>
            <p className="text-[15px] text-[#414942]">
              Create an account to deploy AI Krishi for your enterprise.
            </p>
          </div>

          {/* Registration Form */}
          <form 
            action={async (formData) => {
              "use server"
              const name = formData.get("name") as string
              const email = formData.get("email") as string
              const password = formData.get("password") as string
              
              if (!email || !password || !name) return

              try {
                const hashedPassword = await hash(password, 10)
                await db.user.create({
                  data: {
                    name,
                    email,
                    password: hashedPassword,
                  }
                })
              } catch (error) {
                console.error(error)
                // In production, handle "user already exists" gracefully
              }

              redirect("/login")
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[11px] font-bold text-[#181d18] mb-1.5 uppercase tracking-wider" htmlFor="name">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#414942]/60">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  className="w-full h-11 pl-11 pr-4 bg-white border border-[#c1c9c0]/60 rounded-lg text-[#181d18] placeholder:text-[#414942]/40 focus:outline-none focus:border-[#1b6d24] focus:ring-2 focus:ring-[#1b6d24]/20 transition-all duration-150" 
                  id="name" 
                  name="name" 
                  placeholder="Anita Desai" 
                  required 
                  type="text" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#181d18] mb-1.5 uppercase tracking-wider" htmlFor="email">
                Work Email
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#414942]/60">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  className="w-full h-11 pl-11 pr-4 bg-white border border-[#c1c9c0]/60 rounded-lg text-[#181d18] placeholder:text-[#414942]/40 focus:outline-none focus:border-[#1b6d24] focus:ring-2 focus:ring-[#1b6d24]/20 transition-all duration-150" 
                  id="email" 
                  name="email" 
                  placeholder="name@agrifarm.com" 
                  required 
                  type="email" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#181d18] mb-1.5 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#414942]/60">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  className="w-full h-11 pl-11 pr-11 bg-white border border-[#c1c9c0]/60 rounded-lg text-[#181d18] placeholder:text-[#414942]/40 focus:outline-none focus:border-[#1b6d24] focus:ring-2 focus:ring-[#1b6d24]/20 transition-all duration-150" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••••••" 
                  required 
                  type="password" 
                />
              </div>
            </div>

            <button 
              className="w-full h-12 bg-[#14442a] hover:bg-[#002d17] active:scale-[0.99] text-white text-[15px] font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 group mt-2" 
              type="submit"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Login Prompt */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#414942]">
              Already have an account?
              <Link href="/login" className="text-[#1b6d24] font-semibold hover:text-[#002d17] transition-colors ml-1 underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="pt-6 border-t border-[#c1c9c0]/30 text-center">
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-[#717972] text-[11px] font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              256-Bit SSL Encryption
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Verified className="w-3.5 h-3.5" />
              AgData Transparent
            </span>
          </div>
          <p className="text-[#414942]/60 mt-2 text-xs">
            © 2026 AI Krishi Agritech Systems Inc.
          </p>
        </div>
      </div>
    </div>
  )
}
