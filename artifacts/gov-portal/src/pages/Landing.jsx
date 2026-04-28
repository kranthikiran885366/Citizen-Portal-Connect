import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  Landmark,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronRight,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { clearAuthSession, getAuthSession, getDashboardPath } from "@/lib/auth";

const metrics = [
  { value: "95%", label: "Resolution Rate" },
  { value: "3-Day", label: "Response Time" },
  { value: "1.2M", label: "Citizens Served" },
  { value: "24/7", label: "Active Support" },
];

const steps = [
  {
    icon: FileText,
    title: "Submit",
    desc: "Fill out the official grievance form with relevant details and supporting documents.",
  },
  {
    icon: Clock3,
    title: "Analyze",
    desc: "Department specialists review the submission and assign it to the relevant authority.",
  },
  {
    icon: CheckCircle2,
    title: "Resolve",
    desc: "Receive formal resolution and tracking feedback for your specific case.",
  },
];

const protections = [
  {
    icon: ShieldCheck,
    title: "Verified Identity",
    desc: "Integrated with national ID systems for seamless verification.",
  },
  {
    icon: Clock3,
    title: "Immutable Logs",
    desc: "Every grievance action is time-stamped and traceable.",
  },
  {
    icon: Users,
    title: "Direct Access",
    desc: "Connect directly with department heads and administrators.",
  },
  {
    icon: BarChart3,
    title: "Open Data",
    desc: "Public dashboards showing resolution metrics in real-time.",
  },
];

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Contact Support", href: "#" },
  { label: "Sitemap", href: "#" },
];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Grievances", href: "#grievances" },
  { label: "Departments", href: "#departments" },
  { label: "Resources", href: "#resources" },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(getAuthSession());
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123c8f] text-white shadow-sm shadow-blue-900/20">
              <Shield className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight text-slate-900">Citizen Portal</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-500">Official Government Portal</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 sm:inline-flex" aria-label="Language">
              <Globe className="h-4 w-4" />
            </button>
            {session?.user ? (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <UserCircle2 className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{session.user.name}</span>
                <Link href={getDashboardPath(session.user.role)} className="text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800">
                  Dashboard
                </Link>
                <button type="button" onClick={handleLogout} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950">
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
                  Sign In
                </Link>
                <Link href="/register" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section id="services" className="relative isolate overflow-hidden text-white">
          <div className="absolute inset-0 bg-[#0b2446]" />
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'linear-gradient(90deg, rgba(5,20,45,0.9) 0%, rgba(5,20,45,0.68) 40%, rgba(5,20,45,0.28) 68%, rgba(5,20,45,0.12) 100%), url("/auth-background.png")' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(96,165,250,0.12),_transparent_22%)]" />

          <div className="relative mx-auto grid min-h-[42rem] max-w-7xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-blue-100 shadow-lg shadow-black/10 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-sky-300" />
                OFFICIAL GOVERNMENT PORTAL
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Voice,
                <span className="block text-sky-300">Our Mission.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                Ensuring institutional accountability through transparent governance. Submit your grievances and track progress in real-time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f6feb] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition-transform hover:-translate-y-0.5 hover:bg-[#2b79ff]"
                >
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/6 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/12"
                >
                  Sign In
                  <Clock3 className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-slate-200">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((letter, index) => (
                    <div
                      key={letter}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 font-semibold text-white shadow-md shadow-black/15"
                      style={{ background: ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b"][index] }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">Trusted by 50,000+ citizens</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 hidden lg:block">
              <div className="ml-auto mr-4 max-w-sm rounded-[1.9rem] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0d2240]/78 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <span>Live status</span>
                    <span className="rounded-full bg-white/8 px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] text-sky-200">Secure</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Complaint intake", pct: 84, color: "bg-sky-400" },
                      { label: "Verification queue", pct: 68, color: "bg-amber-400" },
                      { label: "Department routing", pct: 92, color: "bg-emerald-400" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-100">{item.label}</span>
                          <span className="text-slate-300">{item.pct}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.24em] text-slate-300">
                  {[
                    { label: "Verified", value: "100%" },
                    { label: "SLA", value: "3 Day" },
                    { label: "Support", value: "24/7" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3">
                      <div className="text-sm font-semibold text-white normal-case tracking-tight">{item.value}</div>
                      <div className="mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            {metrics.map((metric, index) => (
              <div key={metric.label} className={`px-4 py-4 text-center ${index < 3 ? "lg:border-r lg:border-slate-200" : ""}`}>
                <div className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{metric.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{metric.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="grievances" className="bg-[#f7f9fe] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              A seamless, transparent process designed to prioritize citizen concerns with bureaucratic efficiency.
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#113a86] text-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{step.desc}</p>
                    {index < steps.length - 1 ? <ChevronRight className="mx-auto mt-6 hidden h-4 w-4 text-slate-300 lg:block" /> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="departments" className="relative overflow-hidden bg-[#081f44] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.22),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.16),_transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Institutional Integrity &amp; Security</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                The National Citizen Portal is built on the pillars of data privacy and institutional accountability. Your information is encrypted using military-grade standards.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: Shield,
                    title: "AES-256 Encryption",
                    desc: "All personal data and grievance documents are fully encrypted at rest and in transit.",
                  },
                  {
                    icon: Landmark,
                    title: "Official Oversight",
                    desc: "Continuous auditing by independent government bodies to ensure service transparency.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-200">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {protections.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-xl shadow-black/10 backdrop-blur-md">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/15 text-sky-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer id="resources" className="bg-[#f4f7fb] px-4 py-10 text-slate-600 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8 border-t border-slate-200 pt-10 md:flex-row md:items-start md:justify-between">
              <div className="max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123c8f] text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">Citizen Portal</div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">National grievance platform</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  A transparent public service portal for citizens to file grievances, monitor resolution progress, and hold institutions accountable.
                </p>
                <p className="mt-4 text-xs text-slate-400">&copy; 2024 National Citizen Portal. Official Government Resource.</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Quick Links</h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li><Link href="/citizen" className="transition-colors hover:text-slate-950">Citizen Portal</Link></li>
                    <li><Link href="/officer" className="transition-colors hover:text-slate-950">Officer Portal</Link></li>
                    <li><Link href="/admin" className="transition-colors hover:text-slate-950">Admin Portal</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Contact</h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 1800-XXX-XXXX</li>
                    <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@govcare.gov.in</li>
                    <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> www.govcare.gov.in</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Resources</h4>
                  <ul className="mt-4 space-y-3 text-sm">
                    {footerLinks.map((item) => (
                      <li key={item.label}>
                        <a href={item.href} className="transition-colors hover:text-slate-950">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
