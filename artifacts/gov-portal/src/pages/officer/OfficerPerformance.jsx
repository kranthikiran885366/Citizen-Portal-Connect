import Layout from "@/components/Layout";
import { officerApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import { TrendingUp, Star, CheckCircle, Clock, AlertTriangle, Award, LoaderCircle } from "lucide-react";

export default function OfficerPerformance() {
  const { user } = useAuth();
  const { data: perf, loading } = useApi(() => officerApi.myPerformance(), []);

  const stats = perf || {};
  const exportPerformance = () => {
    const rows = [
      ["metric", "value"],
      ["total_assigned", stats.total_assigned || 0],
      ["resolved_count", stats.resolved_count || 0],
      ["resolution_rate_percent", stats.resolution_rate || 0],
      ["sla_compliance_rate_percent", stats.sla_compliance_rate || 0],
      ["avg_rating", stats.avg_rating || ""],
      ["avg_resolution_days", stats.avg_resolution_days || ""],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "officer-performance.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout role="officer">
      <div className="space-y-5 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Performance Report</h2>
          <p className="text-muted-foreground mt-1">Your detailed performance metrics and resolution statistics.</p>
        </div>
        <div>
          <button onClick={exportPerformance} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
            Export Performance CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Assigned", value: stats.total_assigned || 0, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Resolved", value: stats.resolved_count || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Avg. Rating", value: stats.avg_rating ? `${stats.avg_rating} ★` : "N/A", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "SLA Breaches", value: stats.sla_breaches || 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{s.label}</p>
                        <p className="text-3xl font-bold text-foreground">{s.value}</p>
                      </div>
                      <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Key Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Resolution Rate", value: stats.resolution_rate || 0, suffix: "%", color: "bg-emerald-500" },
                    { label: "SLA Compliance Rate", value: stats.sla_compliance_rate || 0, suffix: "%", color: "bg-blue-500" },
                    { label: "On-Time Resolution", value: stats.on_time_rate || 0, suffix: "%", color: "bg-purple-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 font-medium">{item.label}</span>
                        <span className="font-bold text-slate-950">{item.value}{item.suffix}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${Math.min(item.value, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Time Statistics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Avg. Resolution Time", val: stats.avg_resolution_days ? `${stats.avg_resolution_days} days` : "N/A" },
                    { label: "Fastest Resolution", val: stats.min_resolution_days ? `${stats.min_resolution_days} days` : "N/A" },
                    { label: "Slowest Resolution", val: stats.max_resolution_days ? `${stats.max_resolution_days} days` : "N/A" },
                    { label: "Pending Complaints", val: stats.pending_count || 0 },
                    { label: "In Progress", val: stats.in_progress_count || 0 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm font-bold text-slate-950">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" /> Performance Summary
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Overall Grade",
                    value: (stats.resolution_rate || 0) >= 90 ? "A+" : (stats.resolution_rate || 0) >= 80 ? "A" : (stats.resolution_rate || 0) >= 70 ? "B" : "C",
                    color: (stats.resolution_rate || 0) >= 80 ? "text-emerald-600" : (stats.resolution_rate || 0) >= 70 ? "text-amber-600" : "text-red-500",
                    bg: (stats.resolution_rate || 0) >= 80 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200",
                  },
                  {
                    label: "Citizen Satisfaction",
                    value: stats.avg_rating ? `${stats.avg_rating}/5 ★` : "No ratings",
                    color: "text-amber-600",
                    bg: "bg-amber-50 border-amber-200",
                  },
                  {
                    label: "Department",
                    value: user?.department_name || stats.department_name || "—",
                    color: "text-blue-600",
                    bg: "bg-blue-50 border-blue-200",
                  },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl p-4 border text-center ${item.bg}`}>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
