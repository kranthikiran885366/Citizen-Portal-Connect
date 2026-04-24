import Layout from "@/components/Layout";
import { BarChart3, TrendingUp, Star, Award, CheckCircle, Clock, Target, Zap } from "lucide-react";

const monthlyData = [
  { month: "Jan", assigned: 18, resolved: 15 },
  { month: "Feb", assigned: 22, resolved: 19 },
  { month: "Mar", assigned: 16, resolved: 14 },
  { month: "Apr", assigned: 25, resolved: 21 },
  { month: "May", assigned: 20, resolved: 18 },
  { month: "Jun", assigned: 28, resolved: 24 },
];

const maxVal = Math.max(...monthlyData.map(d => d.assigned));

export default function OfficerPerformance() {
  const totalAssigned = monthlyData.reduce((sum, d) => sum + d.assigned, 0);
  const totalResolved = monthlyData.reduce((sum, d) => sum + d.resolved, 0);
  const avgRate = Math.round((totalResolved / totalAssigned) * 100);

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
          <p className="text-muted-foreground mt-1">Track your complaint resolution metrics and citizen satisfaction scores.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Resolution Rate", value: `${avgRate}%`, icon: Target, color: "text-blue-600", bg: "bg-blue-50", change: 5 },
            { label: "Avg. Resolution Time", value: "3.2 days", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Citizen Rating", value: "4.5 / 5", icon: Star, color: "text-amber-600", bg: "bg-amber-50", change: 3 },
            { label: "SLA Compliance", value: "92%", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", change: -2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-foreground">{item.value}</p>
                    {item.change !== undefined && (
                      <p className={`text-xs font-semibold mt-1.5 ${item.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {item.change >= 0 ? "+" : ""}{item.change}% vs last month
                      </p>
                    )}
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
                <h3 className="font-bold text-foreground">Monthly Performance</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Assigned vs resolved complaints over 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary block" /> Assigned</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 block" /> Resolved</span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-44">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end gap-0.5 h-36">
                    <div
                      className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t-lg transition-colors relative group"
                      style={{ height: `${(d.assigned / maxVal) * 100}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold text-foreground whitespace-nowrap">
                        {d.assigned}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-full bg-primary rounded-t-lg"
                          style={{ height: `${(d.assigned / maxVal) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-colors"
                      style={{ height: `${(d.resolved / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-amber-500" />
                <h3 className="font-bold text-foreground">Citizen Ratings</h3>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = [3, 5, 1, 1, 0][5 - star];
                  const pct = (count / 10) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground w-4">{star}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-4 pt-3 border-t border-border">
                <div className="flex justify-center gap-0.5 mb-1">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className={`text-xl ${i < 4 ? "text-amber-400" : "text-gray-200"}`}>{s}</span>
                  ))}
                </div>
                <p className="text-2xl font-bold text-foreground">4.5</p>
                <p className="text-xs text-muted-foreground">Based on 10 ratings</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-foreground">Achievements</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "5-Star Rating", icon: "⭐", achieved: true },
                  { label: "Zero Breach Month", icon: "🏆", achieved: true },
                  { label: "Speed Resolver", icon: "⚡", achieved: true },
                  { label: "100 Resolved", icon: "🎯", achieved: false },
                ].map((a) => (
                  <div key={a.label} className={`flex items-center gap-3 p-2.5 rounded-xl ${a.achieved ? "bg-blue-50" : "bg-muted/40 opacity-60"}`}>
                    <span className="text-lg">{a.icon}</span>
                    <span className={`text-sm font-semibold ${a.achieved ? "text-blue-800" : "text-muted-foreground"}`}>{a.label}</span>
                    {a.achieved && <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
