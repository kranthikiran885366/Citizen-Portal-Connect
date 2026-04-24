import { useState } from "react";
import Layout from "@/components/Layout";
import { auditLogs } from "@/lib/data";
import { Search, Download, Activity, User, Shield, Cpu, Filter, ChevronDown } from "lucide-react";

const roleConfig = {
  Officer: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: Shield },
  Admin: { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Shield },
  Citizen: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: User },
  System: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: Cpu },
};

const extendedLogs = [
  ...auditLogs,
  { id: 8, action: "Bulk status update: 5 complaints marked In Progress", user: "Admin", role: "Admin", time: "2024-04-11 10:00" },
  { id: 9, action: "New officer account created: Preethi Nair", user: "Admin", role: "Admin", time: "2024-04-10 14:30" },
  { id: 10, action: "SLA policy updated: Medium priority 7 → 5 days", user: "Admin", role: "Admin", time: "2024-04-09 11:15" },
  { id: 11, action: "Complaint CMP-006 resolved by Dr. Anand", user: "Dr. Anand", role: "Officer", time: "2024-04-09 13:00" },
  { id: 12, action: "System maintenance performed", user: "System", role: "System", time: "2024-04-08 02:00" },
];

export default function AdminAudit() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const filtered = extendedLogs.filter(log => {
    const ms = log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const mr = filterRole === "all" || log.role === filterRole;
    return ms && mr;
  }).sort((a, b) => b.id - a.id);

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
            <p className="text-muted-foreground mt-1">Complete audit trail of all system actions, changes, and user activities.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors border border-border">
            <Download className="h-4 w-4" /> Export Logs
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Events", value: extendedLogs.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Admin Actions", value: extendedLogs.filter(l => l.role === "Admin").length, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Officer Actions", value: extendedLogs.filter(l => l.role === "Officer").length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "System Events", value: extendedLogs.filter(l => l.role === "System").length, color: "text-gray-600", bg: "bg-gray-50" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Search audit logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Officer">Officer</option>
                <option value="Citizen">Citizen</option>
                <option value="System">System</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filtered.map((log) => {
              const cfg = roleConfig[log.role] || roleConfig.System;
              const Icon = cfg.icon;
              return (
                <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                  <div className={`p-2 rounded-lg shrink-0 ${cfg.bg} border ${cfg.border}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{log.action}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">by <strong className="text-foreground">{log.user}</strong></span>
                      <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {log.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{log.time}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">#{log.id}</p>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">No audit logs found.</div>
            )}
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium">
            Showing {filtered.length} of {extendedLogs.length} log entries
          </div>
        </div>
      </div>
    </Layout>
  );
}
