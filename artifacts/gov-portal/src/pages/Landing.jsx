import { Link } from "wouter";
import { Shield, FileText, Clock, Users, BarChart3, Building2, CheckCircle, ArrowRight, Star, Phone, Mail, Globe, ChevronRight, TrendingUp, Award } from "lucide-react";
import { departments } from "@/lib/data";

const totalComplaints = departments.reduce((sum, d) => sum + d.complaints, 0);
const totalResolved = departments.reduce((sum, d) => sum + d.resolved, 0);
const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(218, 65%, 14%)" }}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">GovCare</span>
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-widest leading-none mt-0.5">Citizen Services</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Services</a>
            <a href="#departments" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Departments</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">How It Works</a>
            <a href="#stats" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Statistics</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/citizen" className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90" style={{ background: "hsl(213, 82%, 44%)" }}>
              Citizen Login
            </Link>
            <Link href="/officer" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors hidden sm:block">
              Officer
            </Link>
            <Link href="/admin" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors hidden sm:block">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 px-6" style={{ background: "linear-gradient(135deg, hsl(218, 65%, 14%) 0%, hsl(218, 55%, 22%) 50%, hsl(213, 82%, 30%) 100%)" }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1.5 w-6 rounded-full bg-blue-400" />
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">Digital India Initiative</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                Empowering Citizens Through{" "}
                <span className="text-blue-300">Transparent Governance</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                File complaints, track resolutions in real-time, and hold your government accountable. GovCare bridges the gap between citizens and government services.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/citizen/complaint/new" className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-blue-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
                  <FileText className="h-4.5 w-4.5" />
                  File a Complaint
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/citizen/track" className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
                  <Clock className="h-4.5 w-4.5" />
                  Track My Complaint
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
                <div className="flex -space-x-2">
                  {["R","M","A","S","P"].map((l, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-blue-800 flex items-center justify-center text-white text-xs font-bold" style={{ background: ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ef4444"][i] }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex">{"★★★★★".split("").map((s, i) => <span key={i} className="text-yellow-400 text-sm">{s}</span>)}</div>
                  <p className="text-blue-200 text-xs mt-0.5">Trusted by <strong className="text-white">50,000+</strong> citizens</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: "Total Complaints", value: totalComplaints.toLocaleString(), icon: FileText, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
                { label: "Resolved", value: totalResolved.toLocaleString(), icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.15)" },
                { label: "Resolution Rate", value: `${resolutionRate}%`, icon: TrendingUp, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
                { label: "Departments", value: departments.length, icon: Building2, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-2 rounded-xl w-fit mb-3" style={{ background: stat.bg }}>
                      <Icon className="h-5 w-5" style={{ color: stat.color }} />
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-blue-300 text-sm mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-12 px-6 border-b border-gray-100 bg-gray-50 lg:hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4">
          {[
            { label: "Total Complaints", value: totalComplaints.toLocaleString(), icon: FileText, color: "text-blue-600" },
            { label: "Resolved", value: totalResolved.toLocaleString(), icon: CheckCircle, color: "text-emerald-600" },
            { label: "Resolution Rate", value: `${resolutionRate}%`, icon: TrendingUp, color: "text-amber-600" },
            { label: "Departments", value: departments.length, icon: Building2, color: "text-purple-600" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <Icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Our Services</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">Everything You Need in One Place</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A complete platform for citizens, officers, and administrators to manage civic issues efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100",
                title: "Citizen Portal", path: "/citizen",
                desc: "File and track your civic complaints with real-time updates, document uploads, and feedback mechanisms.",
                features: ["3-step complaint filing", "Real-time tracking", "SMS notifications", "Rating system"]
              },
              {
                icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100",
                title: "Officer Portal", path: "/officer",
                desc: "Efficiently manage assigned complaints with SLA monitoring, bulk actions, and performance analytics.",
                features: ["Complaint management", "SLA monitoring", "Performance metrics", "Bulk actions"]
              },
              {
                icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100",
                title: "Admin Portal", path: "/admin",
                desc: "Full system control with analytics, officer management, department oversight, and audit logs.",
                features: ["System analytics", "Officer management", "Department monitoring", "Audit logs"]
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`border ${item.border} rounded-2xl p-6 hover:shadow-lg transition-all group`}>
                  <div className={`p-3 ${item.bg} rounded-xl w-fit mb-4`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {item.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={item.path} className="flex items-center gap-1.5 text-sm font-semibold text-blue-700 group-hover:gap-2.5 transition-all">
                    Access Portal <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Process</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">How GovCare Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Simple, transparent, and accountable. Get your issues resolved in four easy steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Users, title: "Register & Verify", desc: "Create your account using Aadhaar number or mobile OTP verification.", color: "text-blue-600", bg: "bg-blue-50" },
              { step: "02", icon: FileText, title: "File Complaint", desc: "Describe your issue with text, photos, or voice recording for better clarity.", color: "text-indigo-600", bg: "bg-indigo-50" },
              { step: "03", icon: Clock, title: "Track Progress", desc: "Get real-time updates via SMS and app notifications at every stage.", color: "text-amber-600", bg: "bg-amber-50" },
              { step: "04", icon: Star, title: "Rate & Close", desc: "Rate the resolution quality and help us improve government services.", color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 ${item.bg} rounded-xl`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <span className="text-4xl font-black text-gray-100">{item.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 items-center">
                      <div className="w-6 h-0.5 bg-gray-200" />
                      <ChevronRight className="h-4 w-4 text-gray-300 -ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="departments" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Departments</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-3">15 Government Departments</h2>
            <p className="text-gray-500 max-w-xl mx-auto">File complaints with the right department and track their performance in real-time.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {departments.map((dept) => {
              const pct = Math.round((dept.resolved / dept.complaints) * 100);
              return (
                <Link
                  key={dept.id}
                  href={`/department/${dept.id}`}
                  className="group border border-gray-100 hover:border-blue-200 hover:shadow-md bg-white rounded-2xl p-4 transition-all text-center"
                >
                  <div className="text-3xl mb-2.5">{dept.icon}</div>
                  <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-700 leading-tight transition-colors">{dept.name}</h4>
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 85 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444"
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                      <span>{dept.complaints} cases</span>
                      <span style={{ color: pct >= 85 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444" }}>{pct}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, hsl(218, 65%, 14%) 0%, hsl(213, 82%, 28%) 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <Award className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Make a Difference?</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who use GovCare to get their civic issues resolved faster and transparently.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/citizen" className="flex items-center gap-2.5 px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">
              <Users className="h-4.5 w-4.5" />
              Access Citizen Portal
            </Link>
            <Link href="/citizen/track" className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white border border-white/30 hover:bg-white/10 transition-colors">
              <Clock className="h-4.5 w-4.5" />
              Track a Complaint
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "hsl(218, 65%, 14%)" }}>
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">GovCare</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                A digital platform empowering citizens to engage with government services transparently and efficiently.
              </p>
              <p className="text-xs text-gray-600 mt-4">Powered by Digital India Initiative &copy; 2024</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Portals</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/citizen" className="hover:text-white transition-colors">Citizen Portal</Link></li>
                <li><Link href="/officer" className="hover:text-white transition-colors">Officer Portal</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> 1800-XXX-XXXX</li>
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@govcare.gov.in</li>
                <li className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> www.govcare.gov.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>Government of India — Ministry of Electronics &amp; Information Technology</p>
            <p>All rights reserved. Use of this portal implies acceptance of terms of service.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
