import { useState } from "react";
import Layout from "@/components/Layout";
import AdvancedSearch from "@/components/AdvancedSearch";
import ComplaintComments from "@/components/ComplaintComments";
import ComplaintSurvey from "@/components/ComplaintSurvey";
import { complaintApi } from "@/lib/api";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { normalizeComplaintRecord } from "@/lib/complaints";
import { getComplaintFeatureOptions, getComplaintTypeOptions, findDepartmentCatalogEntry } from "@/lib/departmentCatalog";
import { Search, ChevronDown, Eye, Star, LoaderCircle, FileText, Filter, Sparkles } from "lucide-react";

const statusStyle = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

export default function ComplaintHistory() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [page, setPage] = useState(1);
  const [viewed, setViewed] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [actionError, setActionError] = useState("");
  const { mutate, loading: ratingLoading } = useApiMutation();

  const { data, loading, refetch } = useApi(
    () => complaintApi.list({ page, limit: 10, status: filterStatus || undefined, priority: filterPriority || undefined, search: search || undefined }),
    [page, filterStatus, filterPriority]
  );

  const complaints = (data?.complaints || []).map((complaint) => normalizeComplaintRecord(complaint)).filter(Boolean);
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); refetch(); };

  const submitRating = async () => {
    if (!rating) return;
    setActionError("");
    await mutate(
      () => complaintApi.rate(ratingModal.id, rating, feedback),
      () => { setRatingModal(null); setRating(0); setFeedback(""); refetch(); },
      (err) => setActionError(String(err))
    );
  };

  const exportCurrentView = () => {
    const rows = complaints.map((c) => ({
      complaint_number: c.complaint_number,
      title: c.title,
      department: c.department_name || "",
      complaint_type: c.complaintType || "",
      priority: c.priority,
      status: c.status,
      created_at: c.created_at,
      rating: c.rating || "",
    }));
    const headers = Object.keys(rows[0] || { complaint_number: "", title: "", department: "", complaint_type: "", priority: "", status: "", created_at: "", rating: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-complaints-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getComplaintExtras = (complaint) => {
    const departmentMatch = findDepartmentCatalogEntry(complaint.department) || findDepartmentCatalogEntry(complaint.department?.name) || findDepartmentCatalogEntry(complaint.category);
    const complaintTypes = getComplaintTypeOptions(complaint.department || complaint.category);
    const features = getComplaintFeatureOptions(complaint.department || complaint.category);
    const selectedFeatures = Array.isArray(complaint.featureFlags) ? complaint.featureFlags : [];

    return {
      departmentMatch,
      complaintTypes,
      features,
      selectedFeatures,
    };
  };

  return (
    <Layout role="citizen">
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">📋 My Complaints</h2>
            <p className="text-muted-foreground mt-2">Track and manage all your submitted grievances in real-time.</p>
          </div>
        </div>
        
        {actionError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">{actionError}</p>
          </div>
        )}

        <AdvancedSearch />

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : complaints.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No complaints found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Complaint</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Priority</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded block mb-0.5">{c.complaint_number}</span>
                        <p className="text-sm font-semibold text-foreground max-w-[200px] truncate">{c.title}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{c.department_name || "—"}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {c.complaintType && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                              <Sparkles className="h-3 w-3" />
                              {c.complaintType}
                            </span>
                          )}
                        </div>
                      </td>
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
                      <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewed(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          {c.status === "resolved" && !c.rating && (
                            <button onClick={() => setRatingModal(c)} className="p-1.5 rounded-lg hover:bg-amber-50 text-muted-foreground hover:text-amber-500 transition-colors" title="Rate">
                              <Star className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
              {(() => {
                const extras = getComplaintExtras(viewed);
                const shownFeatures = Array.isArray(viewed.featureFlags) ? viewed.featureFlags : extras.selectedFeatures;

                return (
                  <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Complaint Type</p>
                        <p className="mt-1 font-semibold text-foreground">{viewed.complaintType || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Catalog Match</p>
                        <p className="mt-1 font-semibold text-foreground">{extras.departmentMatch?.name || viewed.department_name || viewed.department || "—"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected Features</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {shownFeatures.length > 0 ? shownFeatures.map((feature) => (
                          <span key={feature} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700">
                            {feature}
                          </span>
                        )) : (
                          <span className="rounded-full border border-dashed border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
                            No service features tagged
                          </span>
                        )}
                      </div>
                      {extras.complaintTypes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Department Complaint Types</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {extras.complaintTypes.slice(0, 5).map((type) => (
                              <span key={type} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l: "Department", v: viewed.department_name || "—" },
                  { l: "Priority", v: viewed.priority },
                  { l: "Status", v: viewed.status?.replace("-", " ") },
                  { l: "Location", v: viewed.location || "—" },
                  { l: "Filed On", v: new Date(viewed.created_at).toLocaleDateString() },
                  { l: "Officer", v: viewed.officer_name || "Not assigned" },
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
              {viewed.rating && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= viewed.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />)}
                    <span className="text-sm font-bold text-emerald-700 ml-1">{viewed.rating}/5</span>
                  </div>
                  {viewed.feedback && <p className="text-sm text-emerald-700 mt-1">{viewed.feedback}</p>}
                </div>
              )}
              <div className="p-6 space-y-4">
                <ComplaintComments complaintId={viewed.id} />
                <ComplaintSurvey complaintId={viewed.id} complaintStatus={viewed.status} />
              </div>
            </div>
          </div>
        </div>
      )}

      {ratingModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setRatingModal(null)}>
          <div className="bg-card rounded-2xl max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Rate Resolution</h3>
                <button onClick={() => setRatingModal(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">✕</button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{ratingModal.title}</p>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                    <Star className={`h-8 w-8 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-background resize-none focus:outline-none focus:border-primary mb-4"
                placeholder="Share your feedback (optional)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={() => setRatingModal(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={submitRating} disabled={!rating || ratingLoading} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {ratingLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  Submit Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
