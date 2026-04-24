import Layout from "@/components/Layout";
import { AlertTriangle, XCircle, Clock, CheckCircle } from "lucide-react";

const slaViolations = [
  { id: "CMP-005", dept: "Traffic Police", title: "Traffic Signal Malfunction", priority: "high", daysOverdue: 1, officer: "Inspector Sharma" },
];

const atRisk = [
  { id: "CMP-003", dept: "Water Supply", title: "Water Supply Disruption", priority: "high", hoursLeft: 2, officer: "Unassigned" },
  { id: "CMP-002", dept: "Electricity Board", title: "Street Light Not Working", priority: "medium", hoursLeft: 48, officer: "Anil Verma" },
];

const slaConfig = [
  { priority: "Urgent", sla: "4 hours", compliance: 100 },
  { priority: "High", sla: "48 hours", compliance: 88 },
  { priority: "Medium", sla: "7 days", compliance: 95 },
  { priority: "Low", sla: "14 days", compliance: 98 },
];

export default function AdminSLA() {
  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">SLA Monitoring</h2>
          <p className="text-sm text-muted-foreground">Track and manage SLA compliance across departments</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "SLA Compliance", val: "94%", color: "text-green-600", bg: "bg-green-50" },
            { label: "Active Violations", val: "1", color: "text-red-600", bg: "bg-red-50" },
            { label: "At Risk", val: "2", color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Avg. Resolution", val: "2.3d", color: "text-blue-600", bg: "bg-blue-50" },
          ].map(item => (
            <div key={item.label} className={`${item.bg} border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {slaViolations.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-border bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">SLA Violations ({slaViolations.length})</h3>
            </div>
            <div className="divide-y divide-border">
              {slaViolations.map((v) => (
                <div key={v.id} className="p-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground">{v.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">{v.priority}</span>
                    </div>
                    <p className="font-medium text-foreground mt-0.5">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.dept} • {v.officer}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-red-600">{v.daysOverdue}d overdue</span>
                    <div className="mt-1">
                      <button className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-foreground">At Risk ({atRisk.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {atRisk.map((r) => (
              <div key={r.id} className="p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">{r.priority}</span>
                  </div>
                  <p className="font-medium text-foreground mt-0.5">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.dept} • {r.officer}</p>
                </div>
                <span className={`text-sm font-bold shrink-0 ${r.hoursLeft < 24 ? "text-red-600" : "text-yellow-600"}`}>
                  {r.hoursLeft}h left
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">SLA Configuration</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">SLA Target</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Compliance Rate</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slaConfig.map((s) => (
                  <tr key={s.priority} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{s.priority}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.sla}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-24">
                          <div className={`h-full rounded-full ${s.compliance >= 90 ? "bg-green-500" : "bg-yellow-400"}`} style={{ width: `${s.compliance}%` }} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{s.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.compliance >= 90 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {s.compliance >= 90 ? "Good" : "Needs Attention"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
