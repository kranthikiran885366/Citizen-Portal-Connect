import Layout from "@/components/Layout";
import { departments } from "@/lib/data";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function AdminDepartments() {
  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Department Monitor</h2>
          <p className="text-sm text-muted-foreground">Track all {departments.length} departments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const pct = Math.round((dept.resolved / dept.complaints) * 100);
            const isGood = pct >= 85;
            return (
              <div key={dept.id} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow" data-testid={`dept-admin-${dept.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{dept.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground">{dept.complaints} total complaints</p>
                    </div>
                  </div>
                  {isGood ? (
                    <TrendingUp className="h-4 w-4 text-green-600 shrink-0" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-sm font-bold text-foreground">{dept.complaints}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-green-700">{dept.resolved}</p>
                    <p className="text-xs text-green-600">Resolved</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-yellow-700">{dept.pending}</p>
                    <p className="text-xs text-yellow-600">Pending</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Resolution Rate</span>
                    <span className={`font-bold ${isGood ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-500"}`}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isGood ? "bg-green-500" : pct >= 70 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
