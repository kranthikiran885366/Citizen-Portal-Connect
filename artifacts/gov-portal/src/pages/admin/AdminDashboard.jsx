import { Link } from "wouter";
import Layout from "@/components/Layout";
import { analyticsApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { FileText, CheckCircle, Users, AlertTriangle, TrendingUp, Building2, Activity, ArrowRight, BarChart3, Settings, Sparkles, ChevronRight, LoaderCircle } from "lucide-react";

export default function AdminDashboard() {
  const { data, loading } = useApi(() => analyticsApi.overview(), []);
  const { data: deptData, loading: dLoading } = useApi(() => analyticsApi.departmentStats(), []);
  const { data: officerData, loading: oLoading } = useApi(() => analyticsApi.officerPerformance(), []);

  const overview = data || {};
  const departments = deptData?.departments || deptData || [];
  const officers = officerData?.officers || officerData || [];

  return (
    <Layout role="admin">
      <div className="space-y-8 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Console
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">⚙️ Administration Panel</h2>
            <p className="mt-3 text-lg text-slate-600">
              System-wide control for complaints, officers, departments, SLA tracking, and platform health.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Complaints", value: loading ? "—" : overview.total_complaints || 0 },
                { label: "Resolved", value: loading ? "—" : overview.resolved_complaints || 0 },
                { label: "Officers", value: loading ? "—" : overview.total_officers || 0 },
                { label: "Departments", value: loading ? "—" : overview.total_departments || 0 },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-600 to-purple-700 p-8 text-white shadow-lg shadow-purple-600/20">
            <p className="text-xs uppercase tracking-[0.25em] text-purple-100">System Health</p>
            <h3 className="mt-3 text-2xl font-bold">Platform Overview</h3>
            <p className="mt-3 text-sm leading-6 text-purple-100">
              Real-time metrics on complaint intake, officer productivity, and SLA violations.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-purple-400/50 bg-purple-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-100">Open Cases</p>
                <p className="mt-2 text-xl font-bold">{loading ? "..." : (overview.total_complaints || 0) - (overview.resolved_complaints || 0)}</p>
              </div>
              <div className="rounded-xl border border-purple-400/50 bg-purple-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-100">SLA Violations</p>
                <p className="mt-2 text-xl font-bold">{loading ? "..." : overview.sla_violations || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { title: "Total Complaints", value: overview.total_complaints || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Resolved", value: overview.resolved_complaints || 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "In Progress", value: overview.in_progress_complaints || 0, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
            { title: "Active Officers", value: overview.total_officers || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-slate-950">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold text-slate-950">Department Performance</h3>
                <p className="mt-0.5 text-sm text-slate-500">Resolution rate by department</p>
              </div>
              <Link href="/admin/departments" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3.5 p-5">
              {dLoading ? (
                <div className="flex justify-center py-4"><LoaderCircle className="h-5 w-5 animate-spin text-primary" /></div>
              ) : departments.slice(0, 6).map((dept) => {
                const total = dept.total_complaints || dept.complaints || 0;
                const resolved = dept.resolved_complaints || dept.resolved || 0;
                const percent = total > 0 ? Math.round((resolved / total) * 100) : 0;
                return (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="shrink-0 text-xl">{dept.icon || "🏛️"}</span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="truncate text-sm font-semibold text-slate-950">{dept.name}</span>
                        <span className={`ml-2 shrink-0 text-xs font-bold ${percent >= 90 ? "text-emerald-600" : percent >= 75 ? "text-amber-600" : "text-red-500"}`}>{percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: percent >= 90 ? "#10b981" : percent >= 75 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                    </div>
                    <span className="w-8 shrink-0 text-right text-xs text-slate-500">{total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h3 className="font-bold text-slate-950">Top Officers</h3>
                <p className="mt-0.5 text-sm text-slate-500">Ranked by performance rating</p>
              </div>
              <Link href="/admin/officers" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                Manage <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3 p-5">
              {oLoading ? (
                <div className="flex justify-center py-4"><LoaderCircle className="h-5 w-5 animate-spin text-primary" /></div>
              ) : officers.slice(0, 5).map((officer, index) => {
                const rankColors = ["bg-yellow-400", "bg-gray-300", "bg-amber-600"];
                return (
                  <div key={officer.id} className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${rankColors[index] || "bg-slate-200 text-slate-500"}`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-950">{officer.name}</p>
                      <p className="text-xs text-slate-500">{officer.department_name || officer.department || "—"}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-amber-600">{officer.avg_rating ? `${officer.avg_rating} ★` : "N/A"}</p>
                      <p className="text-xs text-slate-500">{officer.resolved_count || 0}/{officer.total_assigned || 0} resolved</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
              <Link key={item.label} href={item.path} className="group rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
                <div className={`mx-auto mb-2 w-fit rounded-xl p-2.5 ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-sm font-semibold text-slate-950 transition-colors group-hover:text-primary">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
