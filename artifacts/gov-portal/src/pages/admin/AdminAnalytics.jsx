import Layout from "@/components/Layout";
import { departments, complaints } from "@/lib/data";
import { BarChart3, TrendingUp, Download } from "lucide-react";

const monthlyTrend = [
  { month: "Nov", filed: 210, resolved: 180 },
  { month: "Dec", filed: 245, resolved: 210 },
  { month: "Jan", filed: 290, resolved: 260 },
  { month: "Feb", filed: 310, resolved: 275 },
  { month: "Mar", filed: 285, resolved: 265 },
  { month: "Apr", filed: 320, resolved: 290 },
];

const maxBar = Math.max(...monthlyTrend.map(d => d.filed));

export default function AdminAnalytics() {
  const statusCounts = {
    pending: complaints.filter(c => c.status === "pending").length,
    "in-progress": complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };
  const total = complaints.length;

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">System Analytics</h2>
            <p className="text-sm text-muted-foreground">Comprehensive performance overview</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg text-sm text-foreground hover:bg-muted transition-colors" data-testid="button-export">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Monthly Trends</h3>
          <div className="flex items-end gap-3 h-48 pb-6">
            {monthlyTrend.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: "160px" }}>
                  <div className="w-5 bg-blue-200 rounded-t relative group" style={{ height: `${(d.filed / maxBar) * 160}px` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-600 font-medium hidden group-hover:block">{d.filed}</div>
                  </div>
                  <div className="w-5 bg-green-500 rounded-t relative group" style={{ height: `${(d.resolved / maxBar) * 160}px` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-green-600 font-medium hidden group-hover:block">{d.resolved}</div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-blue-200" />Filed</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-500" />Resolved</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {[
                { label: "Pending", count: statusCounts.pending, color: "bg-yellow-400", textColor: "text-yellow-700" },
                { label: "In Progress", count: statusCounts["in-progress"], color: "bg-orange-400", textColor: "text-orange-700" },
                { label: "Resolved", count: statusCounts.resolved, color: "bg-green-500", textColor: "text-green-700" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color} shrink-0`} />
                  <span className="text-sm text-foreground flex-1">{item.label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / total) * 100}%` }} />
                  </div>
                  <span className={`text-sm font-bold ${item.textColor} w-6 text-right`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-4">Top Complaint Categories</h3>
            <div className="space-y-2">
              {departments.slice(0, 5).map((dept) => (
                <div key={dept.id} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{dept.icon}</span>
                  <span className="flex-1 text-foreground truncate">{dept.name}</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(dept.complaints / 421) * 100}%` }} />
                  </div>
                  <span className="text-muted-foreground w-8 text-right">{dept.complaints}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Avg. Resolution Time", val: "2.3 days", trend: "+0.2" },
              { label: "SLA Compliance Rate", val: "94%", trend: "+2%" },
              { label: "Citizen Satisfaction", val: "4.2/5", trend: "+0.1" },
              { label: "First Response Time", val: "4.5 hrs", trend: "-0.3" },
            ].map((m) => (
              <div key={m.label} className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{m.val}</p>
                <p className={`text-xs ${m.trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{m.trend} this month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
