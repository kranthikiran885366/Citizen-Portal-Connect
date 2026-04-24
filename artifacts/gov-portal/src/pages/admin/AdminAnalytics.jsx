import Layout from "@/components/Layout";
import { departments, complaints } from "@/lib/data";
import { BarChart3, TrendingUp, Download, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const monthlyTrend = [
  { month: "Jan", total: 412, resolved: 380 },
  { month: "Feb", total: 378, resolved: 340 },
  { month: "Mar", total: 445, resolved: 398 },
  { month: "Apr", total: 521, resolved: 465 },
  { month: "May", total: 489, resolved: 444 },
  { month: "Jun", total: 567, resolved: 523 },
];

const maxTotal = Math.max(...monthlyTrend.map(d => d.total));

const categoryBreakdown = [
  { label: "Infrastructure", count: 267, color: "bg-blue-500", pct: 17 },
  { label: "Electricity", count: 421, color: "bg-yellow-500", pct: 27 },
  { label: "Water Supply", count: 178, color: "bg-cyan-500", pct: 11 },
  { label: "Traffic", count: 245, color: "bg-red-500", pct: 16 },
  { label: "Health", count: 312, color: "bg-green-500", pct: 20 },
  { label: "Others", count: 144, color: "bg-purple-500", pct: 9 },
];

export default function AdminAnalytics() {
  const totalAll = complaints.length;
  const resolvedAll = complaints.filter(c => c.status === "resolved").length;
  const rate = Math.round((resolvedAll / totalAll) * 100);

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
            <p className="text-muted-foreground mt-1">Comprehensive data analysis across all departments and complaint categories.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors border border-border">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Complaints (YTD)", value: "2,812", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", change: 12 },
            { label: "Resolution Rate", value: `${rate}%`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", change: 5 },
            { label: "Avg. Resolution Time", value: "4.3 days", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", change: -8 },
            { label: "SLA Violations", value: "23", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", change: -15 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-foreground">{item.value}</p>
                    <p className={`text-xs font-semibold mt-1.5 ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {item.change >= 0 ? "+" : ""}{item.change}% vs last month
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Monthly Trend (2024)</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Complaints received vs resolved each month</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Received</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Resolved</span>
              </div>
            </div>
            <div className="flex items-end gap-4 h-48">
              {monthlyTrend.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-1 h-40">
                    <div className="flex-1 bg-blue-100 rounded-t-lg transition-all hover:bg-blue-200 relative" style={{ height: `${(d.total / maxTotal) * 100}%` }}>
                      <div className="absolute inset-0 flex items-end justify-center pb-1 opacity-0 hover:opacity-100 text-[10px] font-bold text-blue-800">{d.total}</div>
                    </div>
                    <div className="flex-1 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600 relative" style={{ height: `${(d.resolved / maxTotal) * 100}%` }}>
                      <div className="absolute inset-0 flex items-end justify-center pb-1 opacity-0 hover:opacity-100 text-[10px] font-bold text-white">{d.resolved}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Complaints by Category</h3>
            <div className="space-y-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{cat.label}</span>
                    <span className="text-muted-foreground font-semibold">{cat.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count} complaints</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Department-wise Performance</h3>
            <p className="text-sm text-muted-foreground mt-0.5">All 15 departments ranked by resolution rate</p>
          </div>
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
                {[...departments].sort((a, b) => (b.resolved / b.complaints) - (a.resolved / a.complaints)).map((dept, i) => {
                  const pct = Math.round((dept.resolved / dept.complaints) * 100);
                  return (
                    <tr key={dept.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="text-lg mr-2">{dept.icon}</span>
                        <span className="text-sm font-semibold text-foreground">{dept.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{dept.complaints}</td>
                      <td className="px-4 py-3 text-sm font-medium text-emerald-600">{dept.resolved}</td>
                      <td className="px-4 py-3 text-sm font-medium text-amber-600">{dept.pending}</td>
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
        </div>
      </div>
    </Layout>
  );
}
