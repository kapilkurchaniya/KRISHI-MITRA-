import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Mail, Lock, Eye, EyeOff, Globe, ArrowRight, Shield, Verified, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
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
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">Orbital Hyperspectral Feed v4.2</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Precision Agriculture at Planetary Scale.
          </h1>
          <p className="text-lg text-white/80 max-w-lg leading-relaxed">
            Synthesizing ground IoT telemetry, multi-band drone spectrometry, and predictive soil hydrology models for enterprise yields.
          </p>

          {/* Telemetry Overlay Card */}
          <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3f69c] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#a3f69c]"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a3f69c]">Field Sensor Node #402 Active</span>
              </div>
              <span className="text-[11px] font-mono text-white/70">ZON-ALPHA-9</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <div className="text-[11px] font-bold text-white/60 mb-1">SOIL MOISTURE</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-white">38%</span>
                  <span className="text-[11px] text-[#a3f69c] font-semibold">Optimal</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#a3f69c] h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <div className="text-[11px] font-bold text-white/60 mb-1">CROP HEALTH</div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-white">98.4%</span>
                  <span className="text-[11px] text-[#a3f69c] font-semibold">Peak</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#a3f69c] h-full rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center gap-4">
          <div className="flex flex-col">
            <p className="text-[15px] text-white/90 italic">
              “AI Krishi increased our harvest yield predictability by 34% across 1,200 acres.”
            </p>
            <span className="text-[11px] font-bold text-[#a3f69c]/90 mt-1 tracking-wider uppercase">
              Harpreet Singh — VP Operations, Sutlej Agri Ventures
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL */}
      <div className="w-full lg:w-[44%] bg-[#f6fbf3] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#002d17] tracking-tight mb-2">Welcome back</h2>
            <p className="text-[15px] text-[#414942]">
              Sign in to access your farm intelligence dashboard, soil telemetry, and predictive crop models.
            </p>
          </div>

          {/* Login Form */}
          <form 
            action={async (formData) => {
              "use server"
              try {
                const email = formData.get("email") as string
                const password = formData.get("password") as string
                await signIn("credentials", {
                  email,
                  password,
                  redirectTo: "/dashboard",
                })
              } catch (error) {
                if (error instanceof Error && error.name === "RedirectError") {
                  throw error
                }
                if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
                  throw error
                }
                // If it's a NextAuth error, it will throw. We should let it throw redirect.
                throw error
              }
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[11px] font-bold text-[#181d18] mb-1.5 uppercase tracking-wider" htmlFor="email">
                Work Email / Farmer ID
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#181d18] uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-[11px] font-bold text-[#1b6d24] hover:text-[#002d17] transition-colors hover:underline">
                  Forgot password?
                </Link>
              </div>
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input className="w-4 h-4 rounded text-[#14442a] focus:ring-[#1b6d24]/30 border-[#c1c9c0]" name="remember" type="checkbox" />
                <span className="ml-2.5 text-[13px] text-[#414942]">
                  Remember this device for 30 days
                </span>
              </label>
            </div>

            <button 
              className="w-full h-12 bg-[#14442a] hover:bg-[#002d17] active:scale-[0.99] text-white text-[15px] font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center space-x-2 group" 
              type="submit"
            >
              <span>Sign in to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#414942]">
              New to AI Krishi?
              <Link href="/register" className="text-[#1b6d24] font-semibold hover:text-[#002d17] transition-colors ml-1 underline underline-offset-2">
                Register your farm
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
