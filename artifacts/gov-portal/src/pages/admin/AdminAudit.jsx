import { useState } from "react";
import Layout from "@/components/Layout";
import { auditApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Search, Activity, LoaderCircle, Filter } from "lucide-react";

const roleColors = {
  admin: "bg-purple-50 text-purple-700 border-purple-200",
  officer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  citizen: "bg-blue-50 text-blue-700 border-blue-200",
  system: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function AdminAudit() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useApi(
    () => auditApi.list({ page, limit: 20, search: search || undefined, role: filterRole || undefined }),
    [page, filterRole]
  );

  const logs = data?.logs || data?.audit_logs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); refetch(); };

  const exportCurrentView = () => {
    const rows = logs.map((log) => ({
      action: log.action || "",
      performed_by: log.performed_by_name || log.user || "System",
      role: log.role || "system",
      entity: log.entity_type ? `${log.entity_type}${log.entity_id ? ` #${log.entity_id}` : ""}` : "",
      ip_address: log.ip_address || "",
      created_at: log.created_at || "",
    }));
    const headers = Object.keys(rows[0] || { action: "", performed_by: "", role: "", entity: "", ip_address: "", created_at: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout role="admin">
      <div className="space-y-5 max-w-6xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
          <p className="text-muted-foreground mt-1">Complete audit trail of all system actions and user activities.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
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
          <div className="flex gap-2">
            <select
              className="px-3 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium"
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="officer">Officer</option>
              <option value="citizen">Citizen</option>
            </select>
            <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              <Filter className="h-4 w-4" />
            </button>
            <button type="button" onClick={exportCurrentView} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
              Export CSV
            </button>
          </div>
        </form>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold text-foreground">Activity Log</h3>
            </div>
            <span className="text-sm text-muted-foreground">{total} total entries</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Performed By</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Entity</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">IP Address</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-foreground max-w-[280px]">{log.action}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{log.performed_by_name || log.user || "System"}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize ${roleColors[log.role] || roleColors.system}`}>
                          {log.role || "system"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground capitalize">
                        {log.entity_type ? `${log.entity_type}${log.entity_id ? ` #${log.entity_id}` : ""}` : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-muted-foreground">{log.ip_address || "—"}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Showing {logs.length} of {total} entries</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
