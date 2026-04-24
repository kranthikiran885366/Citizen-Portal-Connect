import { Link } from "wouter";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { departments, complaints, officers } from "@/lib/data";
import { FileText, CheckCircle, Users, AlertTriangle, TrendingUp, Building2, Activity, ArrowRight } from "lucide-react";

const totalComplaints = complaints.length;
const resolved = complaints.filter(c => c.status === "resolved").length;
const inProgress = complaints.filter(c => c.status === "in-progress").length;

export default function AdminDashboard() {
  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">System overview and analytics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total Complaints" value={totalComplaints} icon={FileText} color="text-blue-600" bg="bg-blue-50" change={12} />
          <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="text-green-600" bg="bg-green-50" change={8} />
          <StatCard title="In Progress" value={inProgress} icon={Activity} color="text-orange-600" bg="bg-orange-50" />
          <StatCard title="Active Officers" value={officers.length} icon={Users} color="text-purple-600" bg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Department Performance</h3>
              <Link href="/admin/departments" className="text-xs text-primary hover:underline flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {departments.slice(0, 5).map((dept) => {
                const pct = Math.round((dept.resolved / dept.complaints) * 100);
                return (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="text-lg">{dept.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate">{dept.name}</span>
                        <span className="text-xs text-green-600 font-medium shrink-0 ml-2">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 90 ? "bg-green-500" : pct >= 75 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{dept.complaints}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Top Officers</h3>
              <Link href="/admin/officers" className="text-xs text-primary hover:underline flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {officers.slice(0, 5).map((officer, i) => (
                <div key={officer.id} className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-primary"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{officer.name}</p>
                    <p className="text-xs text-muted-foreground">{officer.department}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-600">{officer.rating}★</p>
                    <p className="text-xs text-muted-foreground">{officer.resolved}/{officer.assigned}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Analytics", path: "/admin/analytics", icon: TrendingUp, iconColor: "text-blue-600", bg: "bg-blue-50" },
            { label: "Officers", path: "/admin/officers", icon: Users, iconColor: "text-purple-600", bg: "bg-purple-50" },
            { label: "SLA Monitor", path: "/admin/sla", icon: AlertTriangle, iconColor: "text-orange-600", bg: "bg-orange-50" },
            { label: "Audit Logs", path: "/admin/audit", icon: Activity, iconColor: "text-gray-600", bg: "bg-gray-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.path}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/50 transition-all"
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
              >
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
