import { Link } from "wouter";
import { Shield, FileText, Clock, Users, BarChart3, Building2, CheckCircle, ArrowRight, Star } from "lucide-react";
import { departments } from "@/lib/data";

export default function Landing() {
  const totalComplaints = departments.reduce((sum, d) => sum + d.complaints, 0);
  const totalResolved = departments.reduce((sum, d) => sum + d.resolved, 0);
  const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-sidebar text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-7 w-7 text-blue-400" />
            <div>
              <h1 className="font-bold text-lg leading-none">GovCare</h1>
              <p className="text-xs text-blue-300">Citizen Services Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#departments" className="text-blue-200 hover:text-white transition-colors">Departments</a>
            <a href="#how-it-works" className="text-blue-200 hover:text-white transition-colors">How it Works</a>
            <a href="#stats" className="text-blue-200 hover:text-white transition-colors">Stats</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/citizen" className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
              Citizen Login
            </Link>
            <Link href="/officer" className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors hidden sm:block">
              Officer
            </Link>
            <Link href="/admin" className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors hidden sm:block">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 mb-6">
            <CheckCircle className="h-4 w-4" />
            Trusted by 50,000+ citizens
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Your Voice Matters.<br/>
            <span className="text-blue-400">We Listen & Act.</span>
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            File complaints, track progress in real-time, and get issues resolved faster through our transparent, accountable government portal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/citizen/complaint/new" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-lg">
              <FileText className="h-5 w-5" />
              File a Complaint
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/citizen/track" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors border border-white/20">
              <Clock className="h-5 w-5" />
              Track Status
            </Link>
          </div>
        </div>
      </section>

      <section id="stats" className="py-12 px-4 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Complaints", value: totalComplaints.toLocaleString(), icon: FileText, color: "text-blue-600" },
            { label: "Resolved", value: totalResolved.toLocaleString(), icon: CheckCircle, color: "text-green-600" },
            { label: "Resolution Rate", value: `${resolutionRate}%`, icon: BarChart3, color: "text-purple-600" },
            { label: "Departments", value: departments.length, icon: Building2, color: "text-orange-600" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-foreground">How It Works</h3>
            <p className="text-muted-foreground mt-2">Simple 4-step process to get your issues resolved</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Register & Login", desc: "Create your citizen account with Aadhaar or mobile number", icon: Users },
              { step: "2", title: "File Complaint", desc: "Describe your issue with text, photos or voice", icon: FileText },
              { step: "3", title: "Track Progress", desc: "Real-time updates via SMS and in-app notifications", icon: Clock },
              { step: "4", title: "Rate & Feedback", desc: "Rate the resolution and help us improve services", icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {item.step}
                  </div>
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="departments" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-foreground">Government Departments</h3>
            <p className="text-muted-foreground mt-2">Select a department to file your complaint</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/department/${dept.id}`}
                className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md hover:border-primary/50 transition-all group"
                data-testid={`dept-card-${dept.id}`}
              >
                <div className="text-3xl mb-2">{dept.icon}</div>
                <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{dept.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{dept.complaints} cases</p>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.round((dept.resolved / dept.complaints) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1">{Math.round((dept.resolved / dept.complaints) * 100)}% resolved</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-sidebar text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Portal Access</h3>
          <p className="text-blue-200 mb-8">Different access levels for different users</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { role: "Citizen", path: "/citizen", icon: Users, desc: "File and track your complaints", color: "bg-blue-600 hover:bg-blue-500" },
              { role: "Officer", path: "/officer", icon: Shield, desc: "Manage and resolve complaints", color: "bg-green-700 hover:bg-green-600" },
              { role: "Admin", path: "/admin", icon: BarChart3, desc: "System analytics and management", color: "bg-purple-700 hover:bg-purple-600" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.role}
                  href={item.path}
                  className={`block ${item.color} rounded-xl p-5 transition-colors group`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2 text-white" />
                  <h4 className="font-bold text-white mb-1">{item.role} Portal</h4>
                  <p className="text-sm text-white/80">{item.desc}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-white">
                    Enter <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="font-bold text-white">GovCare</span>
        </div>
        <p>Government Citizen Services Portal &copy; 2024. All rights reserved.</p>
        <p className="mt-1 text-xs">Powered by Digital India Initiative</p>
      </footer>
    </div>
  );
}
