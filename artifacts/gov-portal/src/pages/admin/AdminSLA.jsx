import Layout from "@/components/Layout";
import { AlertTriangle, XCircle, Clock, CheckCircle, TrendingDown, Bell } from "lucide-react";

const slaViolations = [
  { id: "CMP-005", dept: "Traffic Police", title: "Traffic Signal Malfunction", priority: "high", daysOverdue: 1, officer: "Inspector Sharma", status: "breached" },
  { id: "CMP-003", dept: "Water Supply", title: "Water Supply Disruption", priority: "high", daysOverdue: 0, officer: "Kavita Joshi", status: "critical", hoursLeft: 2 },
  { id: "CMP-007", dept: "Municipal Corporation", title: "Illegal Construction Report", priority: "medium", daysOverdue: 2, officer: "Rahul Mehta", status: "breached" },
  { id: "CMP-002", dept: "Electricity Board", title: "Street Light Not Working", priority: "medium", daysOverdue: 0, officer: "Anil Verma", status: "warning", hoursLeft: 18 },
  { id: "CMP-009", dept: "Waste Management", title: "Hazardous Waste Dumping", priority: "urgent", daysOverdue: 1, officer: "Ravi Kumar", status: "breached" },
];

const statusCfg = {
  breached: { label: "SLA Breached", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
  critical: { label: "Critical (<6h)", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle },
  warning: { label: "At Risk (<24h)", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock },
  ok: { label: "On Track", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
};

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

export default function AdminSLA() {
  const breached = slaViolations.filter(s => s.status === "breached").length;
  const critical = slaViolations.filter(s => s.status === "critical").length;
  const warning = slaViolations.filter(s => s.status === "warning").length;

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5 max-w-6xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Monitor</h2>
          <p className="text-muted-foreground mt-1">Track service level agreement compliance across all departments and officers.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "SLA Breached", value: breached, icon: XCircle, color: "text-red-700", bg: "bg-red-50" },
            { label: "Critical (<6h)", value: critical, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "At Risk (<24h)", value: warning, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Departments Affected", value: new Set(slaViolations.map(s => s.dept)).size, icon: Bell, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">{breached} SLA violations require immediate attention</p>
            <p className="text-sm text-red-600 mt-0.5">Officers have been notified. Escalation emails have been sent to department heads.</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">SLA Violations & At-Risk Complaints</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Sorted by severity — most urgent first</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Assigned Officer</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Overdue By</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slaViolations.map((item) => {
                  const cfg = statusCfg[item.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded block mb-0.5">{item.id}</span>
                        <p className="text-sm font-semibold text-foreground max-w-[180px] truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{item.dept}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-foreground">{item.officer}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold capitalize">
                          <span className={`h-2 w-2 rounded-full ${priorityDot[item.priority]}`} />
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${item.status === "warning" ? "text-amber-600" : "text-red-600"}`}>
                          {item.status === "warning" ? `${item.hoursLeft}h left` :
                           item.status === "critical" ? `${item.hoursLeft}h left` :
                           `${item.daysOverdue}d overdue`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button className="px-3 py-1.5 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          Escalate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">SLA Policy Configuration</h3>
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
