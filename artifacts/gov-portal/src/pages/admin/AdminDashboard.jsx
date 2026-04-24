import { Link } from "wouter";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { departments, complaints, officers } from "@/lib/data";
import { FileText, CheckCircle, Users, AlertTriangle, TrendingUp, Building2, Activity, ArrowRight, BarChart3, Settings } from "lucide-react";

const totalComplaints = complaints.length;
const resolved = complaints.filter(c => c.status === "resolved").length;
const inProgress = complaints.filter(c => c.status === "in-progress").length;

export default function AdminDashboard() {
  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-6 max-w-6xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">System-wide overview — complaints, officers, and department performance.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Complaints" value={totalComplaints} icon={FileText} color="text-blue-600" bg="bg-blue-50" change={12} />
          <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" change={8} />
          <StatCard title="In Progress" value={inProgress} icon={Activity} color="text-orange-600" bg="bg-orange-50" />
          <StatCard title="Active Officers" value={officers.length} icon={Users} color="text-purple-600" bg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground">Department Performance</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Resolution rate by department</p>
              </div>
              <Link href="/admin/departments" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-5 space-y-3.5">
              {departments.slice(0, 6).map((dept) => {
                const pct = Math.round((dept.resolved / dept.complaints) * 100);
                return (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{dept.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground truncate">{dept.name}</span>
                        <span className={`text-xs font-bold ml-2 shrink-0 ${pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444"
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 w-8 text-right">{dept.complaints}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-bold text-foreground">Top Officers</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Ranked by performance rating</p>
              </div>
              <Link href="/admin/officers" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-5 space-y-3">
              {officers.slice(0, 5).map((officer, i) => {
                const rankColors = ["bg-yellow-400", "bg-gray-300", "bg-amber-600"];
                return (
                  <div key={officer.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${rankColors[i] || "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{officer.name}</p>
                      <p className="text-xs text-muted-foreground">{officer.department}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-600">{officer.rating} ★</p>
                      <p className="text-xs text-muted-foreground">{officer.resolved}/{officer.assigned} resolved</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Analytics", path: "/admin/analytics", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Officers", path: "/admin/officers", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Departments", path: "/admin/departments", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "SLA Monitor", path: "/admin/sla", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Audit Logs", path: "/admin/audit", icon: Activity, color: "text-gray-600", bg: "bg-gray-50" },
            { label: "Settings", path: "/admin/settings", icon: Settings, color: "text-slate-600", bg: "bg-slate-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.path}
                className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className={`p-2.5 rounded-xl ${item.bg} w-fit mx-auto mb-2`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
