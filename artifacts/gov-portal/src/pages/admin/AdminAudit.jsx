import { useState } from "react";
import Layout from "@/components/Layout";
import { auditLogs } from "@/lib/data";
import { Search, Download, Activity, User, Shield, Cpu } from "lucide-react";

const roleIcons = { Admin: Shield, Officer: User, Citizen: User, System: Cpu };
const roleColors = { Admin: "bg-purple-100 text-purple-700", Officer: "bg-green-100 text-green-700", Citizen: "bg-blue-100 text-blue-700", System: "bg-gray-100 text-gray-700" };

export default function AdminAudit() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = auditLogs.filter(log => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || log.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Audit Logs</h2>
            <p className="text-sm text-muted-foreground">Track all system activities</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg text-sm text-foreground hover:bg-muted transition-colors" data-testid="button-export-audit">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <select
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            data-testid="select-role-filter"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Officer">Officer</option>
            <option value="Citizen">Citizen</option>
            <option value="System">System</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((log) => {
              const Icon = roleIcons[log.role] || Activity;
              const colorClass = roleColors[log.role] || "bg-gray-100 text-gray-700";
              return (
                <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors" data-testid={`audit-log-${log.id}`}>
                  <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">by <span className="font-medium">{log.user}</span></span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${colorClass}`}>{log.role}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No logs found
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
