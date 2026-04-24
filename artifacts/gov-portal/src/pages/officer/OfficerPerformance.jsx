import Layout from "@/components/Layout";
import { BarChart3, TrendingUp, Star, Award, CheckCircle, Clock } from "lucide-react";

const monthlyData = [
  { month: "Jan", assigned: 18, resolved: 15 },
  { month: "Feb", assigned: 22, resolved: 20 },
  { month: "Mar", assigned: 19, resolved: 17 },
  { month: "Apr", assigned: 14, resolved: 12 },
];

export default function OfficerPerformance() {
  const maxVal = Math.max(...monthlyData.map(d => d.assigned));

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Your personal analytics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">4.5</p>
            <p className="text-xs text-muted-foreground">Avg. Rating</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">83%</p>
            <p className="text-xs text-muted-foreground">Resolution Rate</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">1.8d</p>
            <p className="text-xs text-muted-foreground">Avg. Resolution Time</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">#3</p>
            <p className="text-xs text-muted-foreground">Dept. Rank</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Monthly Performance</h3>
          <div className="flex items-end gap-4 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 justify-center" style={{ height: "100px" }}>
                  <div
                    className="w-5 bg-blue-200 rounded-t"
                    style={{ height: `${(d.assigned / maxVal) * 100}px` }}
                    title={`Assigned: ${d.assigned}`}
                  />
                  <div
                    className="w-5 bg-green-500 rounded-t"
                    style={{ height: `${(d.resolved / maxVal) * 100}px` }}
                    title={`Resolved: ${d.resolved}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-blue-200" /> Assigned</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-500" /> Resolved</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Citizen Feedback Summary</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const counts = { 5: 7, 4: 2, 3: 1, 2: 0, 1: 0 };
              const total = Object.values(counts).reduce((a, b) => a + b, 0);
              const pct = Math.round((counts[star] / total) * 100);
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-500 w-16">{"★".repeat(star)}{"☆".repeat(5-star)}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-muted-foreground w-8 text-right">{counts[star]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
