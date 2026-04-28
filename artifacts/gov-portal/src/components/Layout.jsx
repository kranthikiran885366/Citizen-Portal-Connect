import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, FileText, Clock, User, Bell, Settings,
  Menu, X, LogOut, Shield, Users, BarChart3,
  Building2, AlertTriangle, ClipboardList, Activity,
  ChevronRight, Sparkles, CircleAlert, Layers, Search, Command
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { notificationApi } from "@/lib/api";

const navItems = {
  citizen: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/citizen" },
    { label: "File Complaint", icon: FileText, path: "/citizen/complaint/new" },
    { label: "Departments", icon: Layers, path: "/citizen/departments" },
    { label: "Track Status", icon: Clock, path: "/citizen/track" },
    { label: "My Complaints", icon: ClipboardList, path: "/citizen/history" },
    { label: "My Profile", icon: User, path: "/citizen/profile" },
    { label: "Statistics", icon: BarChart3, path: "/statistics" },
  ],
  officer: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/officer" },
    { label: "Complaints", icon: ClipboardList, path: "/officer/complaints" },
    { label: "SLA Tracking", icon: AlertTriangle, path: "/officer/sla" },
    { label: "Performance", icon: BarChart3, path: "/officer/performance" },
    { label: "My Profile", icon: User, path: "/officer/profile" },
    { label: "Statistics", icon: BarChart3, path: "/statistics" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { label: "Officers", icon: Users, path: "/admin/officers" },
    { label: "Departments", icon: Building2, path: "/admin/departments" },
    { label: "SLA Monitor", icon: AlertTriangle, path: "/admin/sla" },
    { label: "Audit Logs", icon: Activity, path: "/admin/audit" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
    { label: "Statistics", icon: BarChart3, path: "/statistics" },
  ],
};

const roleConfig = {
  citizen: { label: "Citizen Portal", badge: "CITIZEN", color: "#3b82f6" },
  officer: { label: "Officer Portal", badge: "OFFICER", color: "#10b981" },
  admin: { label: "Admin Portal", badge: "ADMIN", color: "#8b5cf6" },
};

export default function Layout({ role, children }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const notificationRef = useRef(null);
  const commandInputRef = useRef(null);

  const userName = user?.name || "User";
  const items = navItems[role] || navItems.citizen;
  const config = roleConfig[role] || roleConfig.citizen;
  const currentPage = items.find((i) => i.path === location)?.label || "Dashboard";
  const quickLinks = useMemo(() => [
    { label: "Go to dashboard", path: items[0]?.path || "/" },
    { label: "Open profile", path: role === "citizen" ? "/citizen/profile" : role === "officer" ? "/officer/profile" : "/admin/settings" },
    { label: "Open notifications", action: () => setShowNotifications(true) },
  ], [items, role]);

  const commandItems = useMemo(() => {
    const q = commandQuery.trim().toLowerCase();
    const merged = [
      ...items.map((item) => ({ label: item.label, path: item.path })),
      ...quickLinks,
    ];
    if (!q) return merged;
    return merged.filter((item) => item.label.toLowerCase().includes(q) || item.path?.toLowerCase().includes(q));
  }, [items, quickLinks, commandQuery]);

  useEffect(() => {
    const saved = localStorage.getItem("govcare-sidebar-open");
    if (saved === "true") setSidebarOpen(true);
    notificationApi.list()
      .then((res) => {
        const list = res.data?.notifications || res.data || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.is_read).length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("govcare-sidebar-open", String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    setShowNotifications(false);
    setCommandOpen(false);
  }, [location]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (commandOpen) {
      window.setTimeout(() => {
        commandInputRef.current?.focus();
      }, 0);
    } else {
      setCommandQuery("");
    }
  }, [commandOpen]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (showNotifications && notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(180deg,_#f7f9fe_0%,_#eef4ff_100%)] text-foreground">
      <a href="#layout-main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900">
        Skip to main content
      </a>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex`}
        style={{ background: "linear-gradient(180deg, hsl(218, 65%, 13%) 0%, hsl(218, 55%, 16%) 100%)" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-white" strokeWidth={2} />
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

        <div className="mx-3 mt-4 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Portal health</p>
              <p className="text-sm font-semibold text-white">98% SLA coverage</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
            <span>Secure sync active</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-200">
              <CircleAlert className="h-3 w-3" /> Live
            </span>
          </div>
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
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "text-white" : "text-slate-300 hover:text-white"}`}
                style={active ? { background: "hsl(213, 82%, 44%)" } : {}}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "hsl(218, 50%, 20%)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = ""; }}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] capitalize" style={{ color: config.color }}>{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-slate-300 hover:text-white"
            onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(218, 50%, 20%)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white/80 border-b border-white/70 flex items-center justify-between px-5 shrink-0 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-slate-500">{config.label}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-950">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              Search pages
              <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
                <Command className="h-3 w-3" />K
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-4 w-4 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div ref={notificationRef} className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="font-bold text-slate-950 text-sm">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-blue-600 font-semibold hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-400">No notifications</p>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div key={n.id} className={`px-4 py-3 ${!n.is_read ? "bg-blue-50/60" : ""}`}>
                          <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-950 leading-none">{userName}</p>
                <p className="text-xs text-slate-500 capitalize mt-0.5">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main id="layout-main-content" className="flex-1 overflow-y-auto p-4 lg:p-7">
          {children}
        </main>
      </div>

      {commandOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/45 p-4 pt-20 backdrop-blur-sm" onClick={() => setCommandOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-100 p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={commandInputRef}
                  type="text"
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  placeholder="Search pages and quick actions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {commandItems.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-500">No matching pages or actions.</p>
              ) : (
                commandItems.slice(0, 10).map((item) => (
                  <button
                    key={`${item.label}-${item.path || "action"}`}
                    type="button"
                    onClick={() => {
                      if (item.action) item.action();
                      if (item.path) setLocation(item.path);
                      setCommandOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-900">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.path || "quick action"}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
