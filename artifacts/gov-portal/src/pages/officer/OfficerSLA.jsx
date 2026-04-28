import Layout from "@/components/Layout";
import { complaintApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { AlertTriangle, XCircle, Clock, CheckCircle, LoaderCircle, Bell } from "lucide-react";

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

function getSLAStatus(c) {
  if (!c.sla_deadline) return "ok";
  const now = new Date();
  const deadline = new Date(c.sla_deadline);
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  if (hoursLeft < 0) return "breached";
  if (hoursLeft < 6) return "critical";
  if (hoursLeft < 24) return "warning";
  return "ok";
}

const statusCfg = {
  breached: { label: "SLA Breached", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
  critical: { label: "Critical (<6h)", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle },
  warning: { label: "At Risk (<24h)", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
  ok: { label: "On Track", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
};

export default function OfficerSLA() {
  const { data, loading } = useApi(() => complaintApi.list({ limit: 50, status: "pending,acknowledged,in-progress" }), []);
  const complaints = (data?.complaints || []).filter((c) => c.sla_deadline);

  const withStatus = complaints.map((c) => ({ ...c, slaStatus: getSLAStatus(c) }));
  const breached = withStatus.filter((c) => c.slaStatus === "breached");
  const critical = withStatus.filter((c) => c.slaStatus === "critical");
  const warning = withStatus.filter((c) => c.slaStatus === "warning");
  const atRisk = [...breached, ...critical, ...warning];

  const exportAtRisk = () => {
    const rows = atRisk.map((item) => ({
      complaint_number: item.complaint_number,
      title: item.title,
      citizen_name: item.citizen_name || "",
      priority: item.priority,
      sla_deadline: item.sla_deadline,
      sla_status: item.slaStatus,
    }));
    const headers = Object.keys(rows[0] || { complaint_number: "", title: "", citizen_name: "", priority: "", sla_deadline: "", sla_status: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "officer-sla-at-risk.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout role="officer">
      <div className="space-y-5 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Tracking</h2>
          <p className="text-muted-foreground mt-1">Monitor service level agreement compliance for your assigned complaints.</p>
        </div>
        <div>
          <button onClick={exportAtRisk} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
            Export At-Risk CSV
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "SLA Breached", value: breached.length, icon: XCircle, color: "text-red-700", bg: "bg-red-50" },
            { label: "Critical (<6h)", value: critical.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "At Risk (<24h)", value: warning.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Total Monitored", value: complaints.length, icon: Bell, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && breached.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-800">{breached.length} SLA violation{breached.length > 1 ? "s" : ""} require immediate attention</p>
              <p className="text-sm text-red-600 mt-0.5">Please resolve or escalate these complaints immediately.</p>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">SLA Violations & At-Risk Complaints</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Sorted by severity — most urgent first</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : atRisk.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-700 font-bold">All complaints are on track!</p>
              <p className="text-sm text-muted-foreground mt-1">No SLA violations or at-risk complaints.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Citizen</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Deadline</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {atRisk.map((item) => {
                    const cfg = statusCfg[item.slaStatus];
                    const Icon = cfg.icon;
                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded block mb-0.5">{item.complaint_number}</span>
                          <p className="text-sm font-semibold text-foreground max-w-[180px] truncate">{item.title}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-foreground">{item.citizen_name || "—"}</td>
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-1.5 text-xs font-bold capitalize">
                            <span className={`h-2 w-2 rounded-full ${priorityDot[item.priority]}`} />
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                          {new Date(item.sla_deadline).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">SLA Policy Reference</h3>
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { priority: "Urgent", sla: "24 hours", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
              { priority: "High", sla: "3 days", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
              { priority: "Medium", sla: "7 days", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { priority: "Low", sla: "14 days", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
            ].map((p) => (
              <div key={p.priority} className={`rounded-xl p-4 border ${p.bg} ${p.border} text-center`}>
                <p className={`text-sm font-bold ${p.color}`}>{p.priority}</p>
                <p className="text-xl font-bold text-foreground mt-1">{p.sla}</p>
                <p className="text-xs text-muted-foreground mt-0.5">response target</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
