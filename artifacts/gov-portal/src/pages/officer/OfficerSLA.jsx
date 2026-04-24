import Layout from "@/components/Layout";
import { AlertTriangle, Clock, CheckCircle, XCircle, TrendingDown } from "lucide-react";

const slaData = [
  { id: "CMP-003", title: "Water Supply Disruption", priority: "high", filed: "2024-04-14", deadline: "2024-04-17", hoursLeft: 2, status: "critical", dept: "Water Supply" },
  { id: "CMP-005", title: "Traffic Signal Malfunction", priority: "high", filed: "2024-04-13", deadline: "2024-04-16", hoursLeft: 18, status: "warning", dept: "Traffic Police" },
  { id: "CMP-002", title: "Street Light Not Working", priority: "medium", filed: "2024-04-12", deadline: "2024-04-19", hoursLeft: 72, status: "ok", dept: "Electricity Board" },
  { id: "CMP-006", title: "Ambulance Response Delay", priority: "urgent", filed: "2024-04-09", deadline: "2024-04-10", hoursLeft: -24, status: "breached", dept: "Ambulance Services" },
  { id: "CMP-001", title: "Pothole on Main Road", priority: "high", filed: "2024-04-10", deadline: "2024-04-17", hoursLeft: 120, status: "ok", dept: "Infrastructure" },
];

const slaConfig = {
  critical: { label: "Critical", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle, badge: "bg-red-50 text-red-700 border-red-200" },
  warning: { label: "At Risk", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock, badge: "bg-amber-50 text-amber-700 border-amber-200" },
  ok: { label: "On Track", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle, badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  breached: { label: "Breached", color: "text-red-700", bg: "bg-red-100", border: "border-red-300", icon: XCircle, badge: "bg-red-100 text-red-800 border-red-300" },
};

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

export default function OfficerSLA() {
  const breached = slaData.filter(s => s.status === "breached").length;
  const critical = slaData.filter(s => s.status === "critical").length;
  const warning = slaData.filter(s => s.status === "warning").length;
  const ok = slaData.filter(s => s.status === "ok").length;

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">SLA Tracking</h2>
          <p className="text-muted-foreground mt-1">Monitor service level agreement compliance for all your assigned complaints.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Breached", value: breached, color: "text-red-700", bg: "bg-red-50", icon: XCircle },
            { label: "Critical (<6h)", value: critical, color: "text-red-600", bg: "bg-red-50", icon: AlertTriangle },
            { label: "At Risk (<24h)", value: warning, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
            { label: "On Track", value: ok, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">SLA Status Overview</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Complaints sorted by urgency — address critical and at-risk items first.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Filed</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Deadline</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Time Remaining</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slaData.sort((a, b) => a.hoursLeft - b.hoursLeft).map((item) => {
                  const cfg = slaConfig[item.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded block mb-0.5">{item.id}</span>
                        <p className="text-sm font-semibold text-foreground max-w-[180px] truncate">{item.title}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{item.dept}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold capitalize">
                          <span className={`h-2 w-2 rounded-full ${priorityDot[item.priority]}`} />
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{item.filed}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-foreground">{item.deadline}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${item.hoursLeft < 0 ? "text-red-600" : item.hoursLeft < 6 ? "text-red-500" : item.hoursLeft < 24 ? "text-amber-600" : "text-emerald-600"}`}>
                          {item.hoursLeft < 0 ? `${Math.abs(item.hoursLeft)}h overdue` : `${item.hoursLeft}h left`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
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
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-amber-800">SLA Policy Reminder</h4>
              <p className="text-sm text-amber-700 mt-1">
                Complaints must be acknowledged within <strong>24 hours</strong> and resolved within:
                Urgent — 24h · High — 3 days · Medium — 7 days · Low — 14 days.
                SLA breaches are escalated to the Admin and may affect your performance score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
