import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { complaintApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Bell, TrendingUp, Sparkles, ShieldCheck, Activity, ChevronRight, LoaderCircle } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  acknowledged: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-orange-100 text-orange-800 border-orange-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const priorityColors = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const { data, loading } = useApi(() => complaintApi.list({ limit: 5 }), []);
  const complaints = data?.complaints || [];
  const total = data?.total || 0;

  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const active = complaints.filter((c) => !["resolved", "closed", "rejected"].includes(c.status)).length;

  return (
    <Layout role="citizen">
      <div className="space-y-8 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard Overview
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              👋 Welcome, {user?.name?.split(" ")[0] || "Citizen"}
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl">
              Monitor your complaints, track progress, and file new civic requests seamlessly from your dashboard.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Filed", value: loading ? "—" : total, icon: FileText, color: "from-blue-100 to-blue-50" },
                { label: "Active", value: loading ? "—" : active, icon: Activity, color: "from-orange-100 to-orange-50" },
                { label: "Resolved", value: loading ? "—" : resolved, icon: CheckCircle, color: "from-emerald-100 to-emerald-50" },
                { label: "Role", value: "Citizen", icon: ShieldCheck, color: "from-slate-100 to-slate-50" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className={`rounded-xl border border-slate-200 bg-gradient-to-br ${item.color} p-4 shadow-sm`}>
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.15em]">{item.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-950">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-lg shadow-blue-600/20">
            <p className="text-xs uppercase tracking-[0.25em] text-blue-100">Quick Action</p>
            <h3 className="mt-3 text-2xl font-bold">📝 File New Complaint</h3>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Submit your civic issue to the right department and get real-time updates.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-blue-400/50 bg-blue-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Active Cases</p>
                <p className="mt-2 text-xl font-bold">{loading ? "..." : active}</p>
              </div>
              <div className="rounded-xl border border-blue-400/50 bg-blue-500/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Total Filed</p>
                <p className="mt-2 text-xl font-bold">{loading ? "..." : total}</p>
              </div>
            </div>
            <Link href="/citizen/complaint/new" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-100 hover:text-white transition-colors">
              <Plus className="h-4 w-4" /> File Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { title: "Total Filed", value: total, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", grad: "from-blue-100 to-blue-50" },
            { title: "Pending", value: complaints.filter((c) => c.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", grad: "from-amber-100 to-amber-50" },
            { title: "In Progress", value: complaints.filter((c) => c.status === "in-progress").length, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50", grad: "from-orange-100 to-orange-50" },
            { title: "Resolved", value: resolved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", grad: "from-emerald-100 to-emerald-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`rounded-xl border border-slate-200 bg-gradient-to-br ${s.grad} p-4 shadow-sm flex items-center gap-3 transition-all hover:shadow-md`}>
                <div className={`p-2.5 rounded-lg ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-slate-950">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-[0.1em]">{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h3 className="font-bold text-slate-950">Recent Complaints</h3>
              <Link href="/citizen/history" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-8"><LoaderCircle className="h-6 w-6 animate-spin text-primary" /></div>
              ) : complaints.length === 0 ? (
                <div className="py-10 text-center">
                  <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No complaints yet</p>
                  <Link href="/citizen/complaint/new" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                    <Plus className="h-4 w-4" /> File your first complaint
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="w-full text-left rounded-xl border border-slate-100 p-4 hover:border-primary/30 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {c.complaint_number}
                            </span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[c.priority]}`}>
                              {c.priority}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-950 truncate">{c.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{c.department_name || "—"}</p>
                        </div>
                        <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColors[c.status]}`}>
                          {c.status.replace("-", " ")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-950">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "File New Complaint", icon: FileText, path: "/citizen/complaint/new", color: "text-blue-600 bg-blue-50" },
                  { label: "All Departments", icon: Sparkles, path: "/citizen/departments", color: "text-indigo-600 bg-indigo-50" },
                  { label: "Track by ID", icon: Clock, path: "/citizen/track", color: "text-amber-600 bg-amber-50" },
                  { label: "View All History", icon: AlertCircle, path: "/citizen/history", color: "text-orange-600 bg-orange-50" },
                  { label: "Update Profile", icon: CheckCircle, path: "/citizen/profile", color: "text-emerald-600 bg-emerald-50" },
                ].map((action) => {
                  const Icon = action.icon;
                  const [textColor, bgColor] = action.color.split(" ");
                  return (
                    <Link key={action.label} href={action.path} className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
                      <div className={`rounded-lg p-2 ${bgColor}`}>
                        <Icon className={`h-4 w-4 ${textColor}`} />
                      </div>
                      <span className="flex-1 text-sm font-medium text-slate-950">{action.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-primary" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-slate-950">Your Stats</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Total Complaints", val: loading ? "—" : total },
                  { label: "Resolved", val: loading ? "—" : resolved },
                  { label: "Active", val: loading ? "—" : active },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{stat.label}</span>
                    <span className="text-sm font-bold text-slate-950">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)}>
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-500">
                    {selectedComplaint.complaint_number}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-slate-950">{selectedComplaint.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selectedComplaint.description}</p>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-950">✕</button>
              </div>
              <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Department</p>
                  <p className="mt-0.5 font-semibold text-slate-950">{selectedComplaint.department_name || "—"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="mt-0.5 font-semibold text-slate-950 capitalize">{selectedComplaint.status?.replace("-", " ")}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Priority</p>
                  <p className="mt-0.5 font-semibold text-slate-950 capitalize">{selectedComplaint.priority}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Filed On</p>
                  <p className="mt-0.5 font-semibold text-slate-950">{new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedComplaint.location && (
                <div className="mb-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Location</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-950">{selectedComplaint.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
