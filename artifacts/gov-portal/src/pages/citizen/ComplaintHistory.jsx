import { useState } from "react";
import Layout from "@/components/Layout";
import { complaints } from "@/lib/data";
import { Search, Download, Eye, Star, ChevronDown, FileText } from "lucide-react";

const statusStyle = {
  "pending": "bg-amber-50 text-amber-700 border-amber-200",
  "acknowledged": "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  "resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityStyle = {
  "low": "bg-slate-50 text-slate-600",
  "medium": "bg-sky-50 text-sky-700",
  "high": "bg-orange-50 text-orange-700",
  "urgent": "bg-red-50 text-red-700",
};

export default function ComplaintHistory() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchPriority = filterPriority === "all" || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Complaints</h2>
            <p className="text-muted-foreground mt-1">Complete history of all your filed complaints.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors border border-border">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Filed", value: complaints.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Resolved", value: complaints.filter(c => c.status === "resolved").length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "In Progress", value: complaints.filter(c => c.status === "in-progress").length, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Pending", value: complaints.filter(c => c.status === "pending").length, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <FileText className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select className="pl-3 pr-8 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <select className="pl-3 pr-8 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3.5"><span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{c.id}</span></td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="text-sm font-semibold text-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-foreground whitespace-nowrap">{c.department}</td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-3.5"><span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[c.status]}`}>{c.status.replace("-", " ")}</span></td>
                    <td className="px-4 py-3.5"><span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${priorityStyle[c.priority]}`}>{c.priority}</span></td>
                    <td className="px-4 py-3.5">
                      {c.rating ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold">{c.rating}/5</span>
                        </div>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setSelected(c)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-blue-50 transition-colors">
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">No complaints found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium">
            Showing {filtered.length} of {complaints.length} complaints
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{selected.id}</span>
                  <h3 className="text-xl font-bold text-foreground mt-2">{selected.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground ml-2">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Department", val: selected.department },
                  { label: "Filed Date", val: selected.date },
                  { label: "Officer", val: selected.officer || "Unassigned" },
                  { label: "Priority", val: selected.priority },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{item.val}</p>
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-foreground mb-3">Timeline</h4>
              <div className="space-y-0">
                {selected.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i === selected.timeline.length - 1 ? "bg-primary text-white" : "bg-emerald-100 text-emerald-700"}`}>{i + 1}</div>
                      {i < selected.timeline.length - 1 && <div className="w-0.5 h-5 bg-border my-1" />}
                    </div>
                    <div className="pb-4 pt-0.5">
                      <p className="text-sm font-semibold text-foreground capitalize">{t.status.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground">{t.note} · {t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selected.rating && (
                <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-0.5 mb-1">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i} className={`text-xl ${i < selected.rating ? "text-amber-400" : "text-gray-200"}`}>{s}</span>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-700">{selected.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
