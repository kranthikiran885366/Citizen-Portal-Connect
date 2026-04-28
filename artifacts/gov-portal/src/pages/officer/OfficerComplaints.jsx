import { useState } from "react";
import Layout from "@/components/Layout";
import { complaintApi } from "@/lib/api";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { Search, CheckSquare, Square, ChevronDown, Eye, MessageSquare, CheckCircle, XCircle, LoaderCircle, Filter } from "lucide-react";

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

const nextStatuses = {
  pending: ["acknowledged", "in-progress", "rejected"],
  acknowledged: ["in-progress", "rejected"],
  "in-progress": ["resolved", "rejected"],
};

export default function OfficerComplaints() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [viewed, setViewed] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [bulkStatus, setBulkStatus] = useState("resolved");
  const [actionError, setActionError] = useState("");
  const { mutate, loading: mutLoading } = useApiMutation();

  const { data, loading, refetch } = useApi(
    () => complaintApi.list({ page, limit: 15, status: filterStatus || undefined, priority: filterPriority || undefined, search: search || undefined }),
    [page, filterStatus, filterPriority]
  );

  const complaints = data?.complaints || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 15);

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected((s) => s.length === complaints.length ? [] : complaints.map((c) => c.id));

  const handleSearch = (e) => { e.preventDefault(); setPage(1); refetch(); };

  const handleStatusUpdate = async () => {
    if (!newStatus || !viewed) return;
    setActionError("");
    await mutate(
      () => complaintApi.updateStatus(viewed.id, newStatus, statusNote),
      () => { setViewed(null); setStatusNote(""); setNewStatus(""); refetch(); },
      (err) => setActionError(String(err))
    );
  };

  const handleBulkUpdate = async () => {
    if (!selected.length) return;
    setActionError("");
    await mutate(
      () => complaintApi.bulkUpdate(selected, bulkStatus, "Bulk status update"),
      () => { setSelected([]); refetch(); },
      (err) => setActionError(String(err))
    );
  };

  const exportCurrentView = () => {
    const rows = complaints.map((c) => ({
      complaint_number: c.complaint_number,
      title: c.title,
      citizen: c.citizen_name || "",
      department: c.department_name || "",
      priority: c.priority,
      status: c.status,
      created_at: c.created_at,
      sla_deadline: c.sla_deadline || "",
    }));
    const headers = Object.keys(rows[0] || { complaint_number: "", title: "", citizen: "", department: "", priority: "", status: "", created_at: "", sla_deadline: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `officer-complaints-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout role="officer">
      <div className="space-y-5 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Assigned Complaints</h2>
          <p className="text-muted-foreground mt-1">Manage and resolve all complaints assigned to you.</p>
        </div>
        {actionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        {selected.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex-wrap">
            <span className="text-sm font-bold text-blue-800">{selected.length} selected</span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <select className="px-3 py-1.5 border border-blue-200 rounded-lg text-xs font-semibold bg-white" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
                {["acknowledged", "in-progress", "resolved"].map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
              <button onClick={handleBulkUpdate} disabled={mutLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60">
                {mutLoading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                Apply
              </button>
              <button onClick={() => setSelected([])} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">Clear</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
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
              <select className="pl-3 pr-8 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                <option value="">All Status</option>
                {["pending", "acknowledged", "in-progress", "resolved", "closed", "rejected"].map((s) => <option key={s} value={s}>{s.replace("-", " ")}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select className="pl-3 pr-8 py-2.5 border border-border rounded-xl text-sm bg-background appearance-none focus:outline-none focus:border-primary font-medium" value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }}>
                <option value="">All Priority</option>
                {["low", "medium", "high", "urgent"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              <Filter className="h-4 w-4" />
            </button>
            <button type="button" onClick={exportCurrentView} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
              Export CSV
            </button>
          </div>
        </form>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3">
                      <button onClick={toggleAll}>
                        {selected.length === complaints.length && complaints.length > 0
                          ? <CheckSquare className="h-4 w-4 text-primary" />
                          : <Square className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Citizen</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {complaints.map((c) => {
                    const slaBreached = c.sla_deadline && new Date(c.sla_deadline) < new Date() && !["resolved", "closed", "rejected"].includes(c.status);
                    return (
                      <tr key={c.id} className={`hover:bg-muted/20 transition-colors ${selected.includes(c.id) ? "bg-blue-50/50" : ""}`}>
                        <td className="px-4 py-3.5">
                          <button onClick={() => toggleSelect(c.id)}>
                            {selected.includes(c.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded block mb-0.5">{c.complaint_number}</span>
                          <p className="text-sm font-semibold text-foreground max-w-[180px] truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.department_name || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-foreground">{c.citizen_name || "—"}</td>
                        <td className="px-4 py-3.5">
                          <span className="flex items-center gap-1.5 text-xs font-bold capitalize">
                            <span className={`h-2 w-2 rounded-full ${priorityDot[c.priority]}`} />
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[c.status]}`}>
                            {c.status?.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {c.sla_deadline ? (
                            <span className={`text-xs font-bold ${slaBreached ? "text-red-600" : "text-emerald-600"}`}>
                              {slaBreached ? "⚠ Breached" : `Due ${new Date(c.sla_deadline).toLocaleDateString()}`}
                            </span>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setViewed(c); setNewStatus(""); setStatusNote(""); }} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors" title="View & Update">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {complaints.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">No complaints found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Showing {complaints.length} of {total} complaints</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewed && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setViewed(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{viewed.complaint_number}</span>
                  <h3 className="text-xl font-bold text-foreground mt-2">{viewed.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{viewed.description}</p>
                </div>
                <button onClick={() => setViewed(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground ml-2">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l: "Citizen", v: viewed.citizen_name || "—" },
                  { l: "Department", v: viewed.department_name || "—" },
                  { l: "Priority", v: viewed.priority },
                  { l: "Location", v: viewed.location || "—" },
                  { l: "Filed On", v: new Date(viewed.created_at).toLocaleDateString() },
                  { l: "SLA Deadline", v: viewed.sla_deadline ? new Date(viewed.sla_deadline).toLocaleDateString() : "—" },
                ].map((item) => (
                  <div key={item.l} className="bg-muted/50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{item.l}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 capitalize">{item.v}</p>
                  </div>
                ))}
              </div>

              {viewed.timeline && viewed.timeline.length > 0 && (
                <>
                  <h4 className="font-bold text-foreground mb-3">Timeline</h4>
                  {viewed.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === viewed.timeline.length - 1 ? "bg-primary text-white" : "bg-emerald-100 text-emerald-700"}`}>{i + 1}</div>
                      <div>
                        <p className="text-sm font-semibold text-foreground capitalize">{t.status?.replace("-", " ")}</p>
                        <p className="text-xs text-muted-foreground">{t.note} · {new Date(t.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {nextStatuses[viewed.status] && (
                <div className="mt-4 p-4 bg-muted/40 rounded-xl space-y-3">
                  <label className="block text-sm font-bold text-foreground">Update Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {nextStatuses[viewed.status].map((s) => (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 capitalize transition-all ${newStatus === s ? "border-primary bg-primary text-white" : "border-border bg-background text-foreground hover:border-primary/50"}`}
                      >
                        {s.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background resize-none focus:outline-none focus:border-primary"
                    placeholder="Add a note for the citizen..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || mutLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {mutLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                    Update Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
