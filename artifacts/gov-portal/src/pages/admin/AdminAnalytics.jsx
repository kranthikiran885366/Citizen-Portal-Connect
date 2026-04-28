import Layout from "@/components/Layout";
import { analyticsApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { FileText, CheckCircle, Clock, AlertTriangle, Download, LoaderCircle } from "lucide-react";

export default function AdminAnalytics() {
  const { data: overview, loading: oLoading } = useApi(() => analyticsApi.overview(), []);
  const { data: trendsData, loading: tLoading } = useApi(() => analyticsApi.complaintTrends(), []);
  const { data: deptData, loading: dLoading } = useApi(() => analyticsApi.departmentStats(), []);

  const stats = overview || {};
  const trends = trendsData?.trends || trendsData || [];
  const departments = deptData?.departments || deptData || [];
  const maxTotal = trends.length > 0 ? Math.max(...trends.map((d) => d.total || 0)) : 1;

  const rate = stats.total_complaints > 0 ? Math.round(((stats.resolved_complaints || 0) / stats.total_complaints) * 100) : 0;

  const exportReport = () => {
    const overviewRows = [
      ["metric", "value"],
      ["total_complaints", stats.total_complaints || 0],
      ["resolved_complaints", stats.resolved_complaints || 0],
      ["in_progress_complaints", stats.in_progress_complaints || 0],
      ["pending_complaints", stats.pending_complaints || 0],
      ["rejected_complaints", stats.rejected_complaints || 0],
      ["sla_violations", stats.sla_violations || 0],
      ["resolution_rate_percent", rate],
    ];
    const deptRows = [
      [],
      ["department", "total", "resolved", "pending"],
      ...departments.map((department) => [
        department.name || "",
        department.total_complaints || department.complaints || 0,
        department.resolved_complaints || department.resolved || 0,
        department.pending_complaints || department.pending || 0,
      ]),
    ];
    const trendRows = [
      [],
      ["period", "total", "resolved"],
      ...trends.map((trend) => [trend.month || trend.period || "", trend.total || 0, trend.resolved || 0]),
    ];
    const csv = [...overviewRows, ...deptRows, ...trendRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-analytics-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout role="admin">
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
            <p className="text-muted-foreground mt-1">Comprehensive data analysis across all departments and complaint categories.</p>
          </div>
          <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors border border-border">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Complaints", value: oLoading ? "—" : stats.total_complaints || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Resolution Rate", value: oLoading ? "—" : `${rate}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Avg. Resolution Time", value: oLoading ? "—" : stats.avg_resolution_days ? `${stats.avg_resolution_days} days` : "N/A", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "SLA Violations", value: oLoading ? "—" : stats.sla_violations || 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-foreground">{item.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${item.bg}`}><Icon className={`h-5 w-5 ${item.color}`} /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Monthly Trend</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Complaints received vs resolved</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Received</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Resolved</span>
              </div>
            </div>
            {tLoading ? (
              <div className="flex justify-center py-8"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div>
            ) : trends.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No trend data available</p>
            ) : (
              <div className="flex items-end gap-4 h-48">
                {trends.map((d) => (
                  <div key={d.month || d.period} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-1 h-40">
                      <div className="flex-1 bg-blue-100 rounded-t-lg hover:bg-blue-200 relative" style={{ height: `${maxTotal > 0 ? ((d.total || 0) / maxTotal) * 100 : 0}%` }}>
                        <div className="absolute inset-0 flex items-end justify-center pb-1 opacity-0 hover:opacity-100 text-[10px] font-bold text-blue-800">{d.total}</div>
                      </div>
                      <div className="flex-1 bg-emerald-500 rounded-t-lg hover:bg-emerald-600 relative" style={{ height: `${maxTotal > 0 ? ((d.resolved || 0) / maxTotal) * 100 : 0}%` }}>
                        <div className="absolute inset-0 flex items-end justify-center pb-1 opacity-0 hover:opacity-100 text-[10px] font-bold text-white">{d.resolved}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{d.month || d.period}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">System Overview</h3>
            <div className="space-y-3">
              {[
                { label: "Total Complaints", val: stats.total_complaints || 0, color: "bg-blue-500" },
                { label: "Resolved", val: stats.resolved_complaints || 0, color: "bg-emerald-500" },
                { label: "In Progress", val: stats.in_progress_complaints || 0, color: "bg-orange-500" },
                { label: "Pending", val: stats.pending_complaints || 0, color: "bg-amber-500" },
                { label: "Rejected", val: stats.rejected_complaints || 0, color: "bg-red-500" },
              ].map((item) => {
                const pct = stats.total_complaints > 0 ? Math.round((item.val / stats.total_complaints) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-muted-foreground font-semibold">{oLoading ? "—" : `${item.val} (${pct}%)`}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Department-wise Performance</h3>
            <p className="text-sm text-muted-foreground mt-0.5">All departments ranked by resolution rate</p>
          </div>
          {dLoading ? (
            <div className="flex justify-center py-8"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pending</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolution Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...departments].sort((a, b) => {
                    const aRate = (a.total_complaints || a.complaints || 0) > 0 ? (a.resolved_complaints || a.resolved || 0) / (a.total_complaints || a.complaints || 1) : 0;
                    const bRate = (b.total_complaints || b.complaints || 0) > 0 ? (b.resolved_complaints || b.resolved || 0) / (b.total_complaints || b.complaints || 1) : 0;
                    return bRate - aRate;
                  }).map((dept, i) => {
                    const total = dept.total_complaints || dept.complaints || 0;
                    const resolved = dept.resolved_complaints || dept.resolved || 0;
                    const pending = dept.pending_complaints || dept.pending || 0;
                    const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;
                    return (
                      <tr key={dept.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3">
                          <span className="text-lg mr-2">{dept.icon || "🏛️"}</span>
                          <span className="text-sm font-semibold text-foreground">{dept.name}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{total}</td>
                        <td className="px-4 py-3 text-sm font-medium text-emerald-600">{resolved}</td>
                        <td className="px-4 py-3 text-sm font-medium text-amber-600">{pending}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444" }} />
                            </div>
                            <span className={`text-sm font-bold ${pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
