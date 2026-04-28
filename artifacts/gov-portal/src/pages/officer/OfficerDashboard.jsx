import { Link } from "wouter";
import Layout from "@/components/Layout";
import { complaintApi, officerApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import { ClipboardList, CheckCircle, AlertTriangle, Clock, ArrowRight, TrendingUp, Star, Sparkles, Activity, ChevronRight, LoaderCircle } from "lucide-react";

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function OfficerDashboard() {
  const { user } = useAuth();
  const { data: complaintData, loading: cLoading } = useApi(() => complaintApi.list({ limit: 5 }), []);
  const { data: perfData, loading: pLoading } = useApi(() => officerApi.myPerformance(), []);

  const complaints = complaintData?.complaints || [];
  const total = complaintData?.total || 0;
  const perf = perfData || {};

  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const pending = complaints.filter((c) => c.status === "pending").length;
  const inProgress = complaints.filter((c) => c.status === "in-progress").length;

  return (
    <Layout role="officer">
      <div className="space-y-8 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Officer Dashboard
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              🎯 {user?.name?.split(" ")[0] || "Officer"}'s Dashboard
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Your assigned complaints, SLA metrics, and performance analytics.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Assigned", value: cLoading ? "—" : total },
                { label: "Resolved", value: cLoading ? "—" : perf.resolved_count || resolved },
                { label: "Pending", value: cLoading ? "—" : pending },
                { label: "SLA Breaches", value: pLoading ? "—" : perf.sla_breaches || 0 },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-white shadow-lg shadow-emerald-600/20">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-100">Performance Metrics</p>
            <h3 className="mt-3 text-2xl font-bold">Your SLA Compliance</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-100">
              Maintain high resolution rates to improve your SLA compliance score.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Compliance</p>
                <p className="mt-2 text-xl font-bold">{pLoading ? "..." : `${perf.sla_compliance_rate || 0}%`}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">Avg Rating</p>
                <p className="mt-2 text-xl font-bold">{pLoading ? "..." : `${perf.avg_rating || "N/A"}⭐`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { title: "Total Assigned", value: total, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Resolved", value: perf.resolved_count || resolved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "In Progress", value: inProgress, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
            { title: "SLA Breaches", value: perf.sla_breaches || 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-slate-950">{cLoading || pLoading ? "—" : s.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-950">
              <TrendingUp className="h-4 w-4 text-primary" /> My Performance
            </h3>
            {pLoading ? (
              <div className="flex justify-center py-4"><LoaderCircle className="h-5 w-5 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-3 text-sm">
                {[
                  { label: "Resolution Rate", val: `${perf.resolution_rate || 0}%`, color: "text-emerald-600" },
                  { label: "Avg. Resolution Time", val: perf.avg_resolution_days ? `${perf.avg_resolution_days} days` : "N/A", color: "text-blue-600" },
                  { label: "Citizen Rating", val: perf.avg_rating ? `${perf.avg_rating} ★` : "N/A", color: "text-amber-600" },
                  { label: "SLA Compliance", val: `${perf.sla_compliance_rate || 0}%`, color: "text-purple-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
                    <span className="text-slate-500">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-950">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "View All Complaints", path: "/officer/complaints", icon: ClipboardList },
                { label: "Check SLA Status", path: "/officer/sla", icon: AlertTriangle },
                { label: "Performance Report", path: "/officer/performance", icon: Star },
                { label: "My Profile", path: "/officer/profile", icon: Activity },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.path} className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
                    <Icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary" />
                    <span className="flex-1 text-sm font-medium text-slate-950">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-950">Complaint Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Pending", count: pending, color: "bg-amber-400" },
                { label: "In Progress", count: inProgress, color: "bg-orange-400" },
                { label: "Resolved", count: perf.resolved_count || resolved, color: "bg-emerald-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-bold text-slate-950">{cLoading ? "—" : item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: total > 0 ? `${(item.count / total) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h3 className="font-bold text-slate-950">Recent Assigned Complaints</h3>
            <Link href="/officer/complaints" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-4">
            {cLoading ? (
              <div className="flex justify-center py-8"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div>
            ) : complaints.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No complaints assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{c.complaint_number}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-950 truncate">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.department_name || "—"} · {c.citizen_name || "Citizen"}</p>
                    </div>
                    <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[c.status]}`}>
                      {c.status?.replace("-", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
