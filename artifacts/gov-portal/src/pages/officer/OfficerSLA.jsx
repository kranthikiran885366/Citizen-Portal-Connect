import Layout from "@/components/Layout";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

const slaData = [
  { id: "CMP-003", title: "Water Supply Disruption", priority: "high", filed: "2024-04-14", deadline: "2024-04-17", hoursLeft: 2, status: "critical" },
  { id: "CMP-002", title: "Street Light Not Working", priority: "medium", filed: "2024-04-12", deadline: "2024-04-19", hoursLeft: 48, status: "at-risk" },
  { id: "CMP-005", title: "Traffic Signal Malfunction", priority: "high", filed: "2024-04-13", deadline: "2024-04-16", hoursLeft: 0, status: "breached" },
  { id: "CMP-001", title: "Pothole on Main Road", priority: "high", filed: "2024-04-10", deadline: "2024-04-17", hoursLeft: 999, status: "resolved" },
];

const slaColors = {
  critical: { bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700", icon: AlertTriangle, iconColor: "text-red-600" },
  "at-risk": { bg: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700", icon: Clock, iconColor: "text-yellow-600" },
  breached: { bg: "bg-red-100 border-red-300", badge: "bg-red-200 text-red-800", icon: XCircle, iconColor: "text-red-700" },
  resolved: { bg: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700", icon: CheckCircle, iconColor: "text-green-600" },
};

export default function OfficerSLA() {
  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">SLA Tracking</h2>
          <p className="text-sm text-muted-foreground">Monitor response time commitments</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Breached", val: 1, color: "text-red-600", bg: "bg-red-50" },
            { label: "Critical", val: 1, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "At Risk", val: 1, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "On Track", val: 1, color: "text-green-600", bg: "bg-green-50" },
          ].map(item => (
            <div key={item.label} className={`${item.bg} border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${item.color}`}>{item.val}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">SLA Status by Complaint</h3>
          </div>
          <div className="divide-y divide-border">
            {slaData.map((item) => {
              const style = slaColors[item.status];
              const Icon = style.icon;
              return (
                <div key={item.id} className={`p-4 ${item.status !== "resolved" ? style.bg : ""} border-l-4 ${
                  item.status === "breached" ? "border-l-red-500" :
                  item.status === "critical" ? "border-l-red-400" :
                  item.status === "at-risk" ? "border-l-yellow-400" :
                  "border-l-green-400"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 ${style.iconColor} mt-0.5 shrink-0`} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                            {item.status === "at-risk" ? "At Risk" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                        <p className="font-medium text-foreground mt-0.5">{item.title}</p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Filed: {item.filed}</span>
                          <span>Deadline: {item.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.status === "resolved" ? (
                        <span className="text-sm font-medium text-green-600">Resolved</span>
                      ) : item.status === "breached" ? (
                        <span className="text-sm font-bold text-red-600">SLA Breached</span>
                      ) : (
                        <span className={`text-sm font-bold ${item.hoursLeft < 24 ? "text-red-600" : "text-yellow-600"}`}>
                          {item.hoursLeft}h left
                        </span>
                      )}
                    </div>
                  </div>
                  {item.status !== "resolved" && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden border border-border">
                        <div
                          className={`h-full rounded-full ${
                            item.status === "breached" ? "bg-red-500 w-full" :
                            item.status === "critical" ? "bg-red-400" :
                            "bg-yellow-400"
                          }`}
                          style={{ width: item.status === "breached" ? "100%" : item.status === "critical" ? "90%" : "60%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
