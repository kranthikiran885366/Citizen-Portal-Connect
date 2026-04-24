import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Clock, User, Bell, Settings,
  Menu, X, LogOut, Shield, Users, BarChart3,
  Building2, AlertTriangle, ClipboardList, Activity,
  ChevronRight
} from "lucide-react";

const navItems = {
  citizen: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/citizen" },
    { label: "File Complaint", icon: FileText, path: "/citizen/complaint/new" },
    { label: "Track Status", icon: Clock, path: "/citizen/track" },
    { label: "My Complaints", icon: ClipboardList, path: "/citizen/history" },
    { label: "My Profile", icon: User, path: "/citizen/profile" },
  ],
  officer: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/officer" },
    { label: "Complaints", icon: ClipboardList, path: "/officer/complaints" },
    { label: "SLA Tracking", icon: AlertTriangle, path: "/officer/sla" },
    { label: "Performance", icon: BarChart3, path: "/officer/performance" },
    { label: "My Profile", icon: User, path: "/officer/profile" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { label: "Officers", icon: Users, path: "/admin/officers" },
    { label: "Departments", icon: Building2, path: "/admin/departments" },
    { label: "SLA Monitor", icon: AlertTriangle, path: "/admin/sla" },
    { label: "Audit Logs", icon: Activity, path: "/admin/audit" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ],
};

const roleConfig = {
  citizen: { label: "Citizen Portal", badge: "CITIZEN", color: "#3b82f6" },
  officer: { label: "Officer Portal", badge: "OFFICER", color: "#10b981" },
  admin: { label: "Admin Portal", badge: "ADMIN", color: "#8b5cf6" },
};

export default function Layout({ role, children, userName = "User" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const items = navItems[role] || navItems.citizen;
  const config = roleConfig[role] || roleConfig.citizen;
  const currentPage = items.find(i => i.path === location)?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-60 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `} style={{ background: "hsl(218, 65%, 14%)" }}>
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "hsl(218, 45%, 22%)" }}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Shield className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-none">GovCare</div>
              <div className="text-[10px] font-semibold mt-0.5 uppercase tracking-widest" style={{ color: config.color }}>
                {config.badge}
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white p-1">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pt-2 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1.5" style={{ color: "hsl(213, 20%, 45%)" }}>
            Navigation
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-sidebar-foreground hover:text-white"
                }`}
                style={active ? { background: "hsl(213, 82%, 44%)" } : {}}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "hsl(218, 50%, 20%)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = ""; }}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "hsl(218, 45%, 22%)" }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] capitalize" style={{ color: config.color }}>{role}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-sidebar-foreground hover:text-white"
            onMouseEnter={e => { e.currentTarget.style.background = "hsl(218, 50%, 20%)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = ""; }}
          >
            <LogOut className="h-4 w-4" />
            Switch Portal
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-5 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{config.label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card"></span>
            </button>
            <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-border">
              <div className="h-8 w-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
