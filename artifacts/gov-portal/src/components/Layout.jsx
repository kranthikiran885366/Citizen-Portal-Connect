import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Clock, User, Bell, Settings,
  Menu, X, LogOut, Shield, Users, BarChart3,
  Building2, AlertTriangle, ClipboardList, Activity
} from "lucide-react";

const navItems = {
  citizen: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/citizen" },
    { label: "File Complaint", icon: FileText, path: "/citizen/complaint/new" },
    { label: "Track Status", icon: Clock, path: "/citizen/track" },
    { label: "My History", icon: ClipboardList, path: "/citizen/history" },
    { label: "Profile", icon: User, path: "/citizen/profile" },
  ],
  officer: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/officer" },
    { label: "Assigned Complaints", icon: ClipboardList, path: "/officer/complaints" },
    { label: "SLA Tracking", icon: AlertTriangle, path: "/officer/sla" },
    { label: "Performance", icon: BarChart3, path: "/officer/performance" },
    { label: "Profile", icon: User, path: "/officer/profile" },
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

const roleLabels = {
  citizen: { label: "Citizen Portal", color: "text-blue-400" },
  officer: { label: "Officer Portal", color: "text-green-400" },
  admin: { label: "Admin Portal", color: "text-purple-400" },
};

export default function Layout({ role, children, userName = "User" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const items = navItems[role] || navItems.citizen;
  const roleInfo = roleLabels[role] || roleLabels.citizen;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-foreground flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <span className="font-bold text-white text-sm">GovCare</span>
            </div>
            <p className={`text-xs mt-0.5 ${roleInfo.color}`}>{roleInfo.label}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-sidebar-foreground hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-primary text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-white text-sm font-bold">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground capitalize">{role}</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Switch Portal
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-foreground">
              {items.find(i => i.path === location)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-1.5 rounded-md hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
