import { useState } from "react";
import Layout from "@/components/Layout";
import { complaints } from "@/lib/data";
import { Search, CheckSquare, Square, ChevronDown, Eye, MessageSquare, CheckCircle, XCircle } from "lucide-react";

const statusStyle = {
  "pending": "bg-amber-50 text-amber-700 border-amber-200",
  "acknowledged": "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  "resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityDot = {
  "low": "bg-slate-400", "medium": "bg-sky-500", "high": "bg-orange-500", "urgent": "bg-red-500",
};

export default function OfficerComplaints() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState([]);
  const [viewed, setViewed] = useState(null);

  const filtered = complaints.filter(c => {
    const ms = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === "all" || c.status === filterStatus;
    return ms && mf;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id));

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assigned Complaints</h2>
          <p className="text-muted-foreground mt-1">Manage and resolve all complaints assigned to you.</p>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-sm font-bold text-blue-800">{selected.length} selected</span>
            <div className="flex gap-2 ml-auto">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" /> Add Note
              </button>
              <button onClick={() => setSelected([])} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
                Clear
              </button>
            </div>
          </div>
        )}

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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3">
                    <button onClick={toggleAll}>
                      {selected.length === filtered.length && filtered.length > 0
                        ? <CheckSquare className="h-4 w-4 text-primary" />
                        : <Square className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Citizen</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className={`hover:bg-muted/20 transition-colors ${selected.includes(c.id) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleSelect(c.id)}>
                        {selected.includes(c.id)
                          ? <CheckSquare className="h-4 w-4 text-primary" />
                          : <Square className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{c.id}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground max-w-[180px] truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.department}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-foreground">{c.citizen}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs font-bold capitalize">
                        <span className={`h-2 w-2 rounded-full ${priorityDot[c.priority]}`} />
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[c.status]}`}>
                        {c.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{c.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewed(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        {c.status !== "resolved" && (
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-muted-foreground hover:text-emerald-600 transition-colors" title="Mark Resolved">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No complaints found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium flex justify-between">
            <span>Showing {filtered.length} of {complaints.length} complaints</span>
            {selected.length > 0 && <span className="text-primary font-bold">{selected.length} selected</span>}
          </div>
        </div>
      </div>

      {viewed && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setViewed(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{viewed.id}</span>
                  <h3 className="text-xl font-bold text-foreground mt-2">{viewed.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{viewed.description}</p>
                </div>
                <button onClick={() => setViewed(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground ml-2">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l: "Citizen", v: viewed.citizen },
                  { l: "Department", v: viewed.department },
                  { l: "Priority", v: viewed.priority },
                  { l: "Date Filed", v: viewed.date },
                ].map((item) => (
                  <div key={item.l} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{item.l}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{item.v}</p>
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-foreground mb-3">Timeline</h4>
              {viewed.timeline.map((t, i) => (
                <div key={i} className="flex gap-3 mb-3">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === viewed.timeline.length - 1 ? "bg-primary text-white" : "bg-emerald-100 text-emerald-700"}`}>{i + 1}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground capitalize">{t.status.replace("-", " ")}</p>
                    <p className="text-xs text-muted-foreground">{t.note} · {t.date}</p>
                  </div>
                </div>
              ))}
              {viewed.status !== "resolved" && (
                <div className="mt-4 p-4 bg-muted/40 rounded-xl">
                  <label className="block text-sm font-bold text-foreground mb-2">Add Status Note</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background resize-none focus:outline-none focus:border-primary" placeholder="Update note for citizen..." />
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">Update Status</button>
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">Mark Resolved</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
