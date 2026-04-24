import { useState } from "react";
import Layout from "@/components/Layout";
import { complaints } from "@/lib/data";
import { Search, CheckCircle, Clock, AlertCircle, FileText, Building2, User, MapPin } from "lucide-react";

const statusConfig = {
  submitted: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100", label: "Submitted" },
  acknowledged: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100", label: "Acknowledged" },
  "in-progress": { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100", label: "In Progress" },
  resolved: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", label: "Resolved" },
};

const statusBadge = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityBadge = {
  low: "bg-slate-50 text-slate-600 border-slate-200",
  medium: "bg-sky-50 text-sky-700 border-sky-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
};

export default function TrackStatus() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const c = complaints.find(c => c.id.toLowerCase() === query.trim().toLowerCase());
    setFound(c || null);
  };

  const progress = found ? (
    { submitted: 1, acknowledged: 2, "in-progress": 3, resolved: 4 }[found.status] || 1
  ) : 0;

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Track Complaint Status</h2>
          <p className="text-muted-foreground mt-1">Enter your complaint ID to check real-time status and timeline.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm bg-card focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="Enter Complaint ID (e.g. CMP-001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: "hsl(213, 82%, 44%)" }}
          >
            Track
          </button>
        </form>

        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sample Complaint IDs</p>
          <div className="flex flex-wrap gap-2">
            {complaints.map(c => (
              <button
                key={c.id}
                onClick={() => setQuery(c.id)}
                className="px-3 py-1.5 bg-muted border border-border rounded-lg text-xs font-mono font-semibold hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {searched && !found && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-red-700 font-bold">No Complaint Found</p>
            <p className="text-sm text-red-500 mt-1">Please verify the complaint ID and try again. IDs are case-insensitive.</p>
          </div>
        )}

        {found && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border" style={{ background: "linear-gradient(135deg, hsl(218, 65%, 14%) 0%, hsl(213, 82%, 30%) 100%)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded mb-2 inline-block">{found.id}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{found.title}</h3>
                  <p className="text-blue-200 text-sm mt-1">{found.description}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge[found.status]}`}>
                    {found.status.replace("-", " ")}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priorityBadge[found.priority]}`}>
                    {found.priority}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
                {[
                  { icon: Building2, label: "Department", val: found.department },
                  { icon: User, label: "Officer", val: found.officer || "Not assigned" },
                  { icon: Clock, label: "Filed On", val: found.date },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Icon className="h-3 w-3 text-blue-300" />
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wide">{item.label}</p>
                      </div>
                      <p className="text-sm font-semibold text-white">{item.val}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-foreground">Progress</h4>
                  <span className="text-sm text-muted-foreground">{progress} / 4 stages</span>
                </div>
                <div className="flex items-center gap-2">
                  {["Submitted", "Acknowledged", "In Progress", "Resolved"].map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`h-2.5 w-full rounded-full ${i < progress ? "bg-primary" : "bg-muted"} transition-all`} />
                      <span className={`text-[10px] font-semibold ${i < progress ? "text-primary" : "text-muted-foreground"} hidden sm:block`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-foreground mb-4">Activity Timeline</h4>
              <div className="space-y-0">
                {found.timeline.map((t, i) => {
                  const cfg = statusConfig[t.status] || statusConfig.submitted;
                  const Icon = cfg.icon;
                  const isLast = i === found.timeline.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${isLast ? "bg-primary" : cfg.bg}`}>
                          <Icon className={`h-4 w-4 ${isLast ? "text-white" : cfg.color}`} />
                        </div>
                        {!isLast && <div className="w-0.5 flex-1 bg-border my-1.5 min-h-[20px]" />}
                      </div>
                      <div className="pb-5 pt-1 flex-1">
                        <div className="flex items-baseline gap-2">
                          <p className="text-sm font-bold text-foreground capitalize">{t.status.replace("-", " ")}</p>
                          <p className="text-xs text-muted-foreground">{t.date}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{t.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {found.rating && (
                <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1 mb-1">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className={`text-lg ${i < found.rating ? "text-amber-400" : "text-gray-200"}`}>{s}</span>
                    ))}
                    <span className="text-sm font-bold text-emerald-700 ml-2">{found.rating}/5</span>
                  </div>
                  <p className="text-sm text-emerald-700">{found.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
