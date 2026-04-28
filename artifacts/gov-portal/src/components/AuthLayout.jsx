import { Link } from "wouter";
import { Shield, Sparkles, Headset, ShieldCheck, Clock3 } from "lucide-react";

export default function AuthLayout({ eyebrow, title, subtitle, children, sideTitle, sideText, imageClassName = "" }) {
  return (
    <div className="min-h-screen bg-[#f5f7fd] text-slate-900">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#123c8f] text-white shadow-sm shadow-blue-950/20">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="leading-none">
              <div className="text-sm font-semibold tracking-tight text-slate-950">Citizen Portal</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-500">Official Government Portal</div>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link href="/" className="transition-colors hover:text-slate-950">Home</Link>
            <a href="#help" className="transition-colors hover:text-slate-950">Help Center</a>
            <a href="#contact" className="transition-colors hover:text-slate-950">Contact Us</a>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="text-slate-600 transition-colors hover:text-slate-950">Login</Link>
            <Link href="/register" className="rounded-md bg-slate-950 px-4 py-2 font-semibold text-white transition-colors hover:bg-slate-800">Register</Link>
          </div>
        </div>
      </div>

      <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-stretch gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.02fr] lg:px-8 lg:py-14">
        <section className="relative h-full overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className={`relative flex h-full min-h-[34rem] flex-col justify-end bg-cover bg-center bg-no-repeat ${imageClassName}`} style={{ backgroundImage: 'linear-gradient(180deg, rgba(5,20,45,0.1) 0%, rgba(5,20,45,0.22) 48%, rgba(5,20,45,0.86) 100%), url("/auth-background.png")' }}>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,26,54,0.42),rgba(8,26,54,0.04))]" />
            <div className="relative z-10 max-w-md p-8 text-white sm:p-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-sky-100 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Secure Civic Services
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{sideTitle}</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-100/90 sm:text-base">{sideText}</p>
            </div>
          </div>
        </section>

        <section className="flex h-full items-center justify-center">
          <div className="w-full max-w-[38rem] rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="max-w-lg">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                {eyebrow}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{subtitle}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                  <Clock3 className="h-3.5 w-3.5 text-blue-600" /> 24/7 Access
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                  <Headset className="h-3.5 w-3.5 text-violet-600" /> Assisted Support
                </span>
              </div>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}