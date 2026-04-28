import { useState } from "react";
import Layout from "@/components/Layout";
import { complaintApi } from "@/lib/api";
import { Search, CheckCircle, Clock, AlertCircle, FileText, Building2, User, MapPin, LoaderCircle, Star } from "lucide-react";

const statusConfig = {
  pending: { icon: FileText, color: "text-amber-600", bg: "bg-amber-100", label: "Pending" },
  acknowledged: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100", label: "Acknowledged" },
  "in-progress": { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100", label: "In Progress" },
  resolved: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", label: "Resolved" },
  closed: { icon: CheckCircle, color: "text-gray-600", bg: "bg-gray-100", label: "Closed" },
  rejected: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: "Rejected" },
};

const statusBadge = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const priorityBadge = {
  low: "bg-slate-50 text-slate-600 border-slate-200",
  medium: "bg-sky-50 text-sky-700 border-sky-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
};

const stages = ["Pending", "Acknowledged", "In Progress", "Resolved"];
const stageMap = { pending: 1, acknowledged: 2, "in-progress": 3, resolved: 4, closed: 4 };

export default function TrackStatus() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setFound(null);
    setSearched(true);
    try {
      const res = await complaintApi.track(query.trim().toUpperCase());
      setFound(res.data);
    } catch (err) {
      setFound(null);
      setError(err.message || "Complaint not found");
    } finally {
      setLoading(false);
    }
  };

  const progress = found ? (stageMap[found.status] || 1) : 0;

  return (
    <Layout role="citizen">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">🔍 Track Your Complaint</h2>
          <p className="text-lg text-slate-600 mt-2">Enter your complaint ID to check real-time status, updates, and timeline.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all uppercase placeholder:text-slate-400"
              placeholder="CMP-2024-001"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "🔎"}
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {searched && !loading && !found && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-lg font-bold text-red-900">Complaint Not Found</p>
            <p className="text-sm text-red-600 mt-2">{error || "Please verify your complaint ID and try again."}</p>
          </div>
        )}

        {found && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <span className="text-xs font-mono font-bold bg-blue-500/30 border border-blue-400/50 text-blue-100 px-3 py-1.5 rounded-full inline-block mb-3">
                    {found.complaint_number}
                  </span>
                  <h3 className="text-2xl font-bold mt-2">{found.title}</h3>
                  <p className="text-blue-100 text-sm mt-2 line-clamp-2">{found.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap ${statusBadge[found.status]}`}>
                    ● {found.status?.replace("-", " ").toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap ${priorityBadge[found.priority]}`}>
                    🎯 {found.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-400/30">
                {[
                  { icon: Building2, label: "Department", val: found.department_name || "—" },
                  { icon: User, label: "Officer", val: found.officer_name || "Unassigned" },
                  { icon: Clock, label: "Filed", val: new Date(found.created_at).toLocaleDateString() },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="h-4 w-4 text-blue-200" />
                        <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wide">{item.label}</p>
                      </div>
                      <p className="text-sm font-semibold text-white">{item.val}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-950 text-lg">Progress Tracker</h4>
                  <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{progress} / {stages.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  {stages.map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`h-2 w-full rounded-full transition-all ${i < progress ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-slate-200"}`} />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {found.location && (
                <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="font-medium">{found.location}</span>
                </div>
              )}

              {found.timeline && found.timeline.length > 0 && (
                <>
                  <div>
                    <h4 className="font-bold text-slate-950 text-lg mb-4">📋 Activity Timeline</h4>
                    <div className="space-y-3">
                      {found.timeline.map((t, i) => {
                        const cfg = statusConfig[t.status] || statusConfig.pending;
                        const Icon = cfg.icon;
                        const isLast = i === found.timeline.length - 1;
                        return (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${isLast ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : cfg.bg}`}>
                                {isLast ? <CheckCircle className="h-5 w-5" /> : <Icon className={`h-5 w-5 ${cfg.color}`} />}
                              </div>
                              {!isLast && <div className="w-1 flex-1 bg-gradient-to-b from-slate-300 to-slate-200 my-2 min-h-[30px]" />}
                            </div>
                            <div className="pb-4 pt-1.5 flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-sm font-bold text-slate-950 capitalize">{t.status?.replace("-", " ")}</p>
                                <p className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString()}</p>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">{t.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {found.rating && (
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= found.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-emerald-700">{found.rating}/5 - ⭐ Resolved</span>
                  </div>
                  {found.feedback && <p className="text-sm text-emerald-700">{found.feedback}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
