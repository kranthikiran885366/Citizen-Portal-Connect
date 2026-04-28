import { useState } from "react";
import Layout from "@/components/Layout";
import { officerApi, departmentApi } from "@/lib/api";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { Search, Plus, Edit, Trash2, Star, Users, CheckCircle, AlertTriangle, LoaderCircle } from "lucide-react";

function validate(form) {
  if (!form.name?.trim() || form.name.trim().length < 2) return "Name must be at least 2 characters";
  if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
  if (!form.password && !form.id) { if (!form.password || form.password.length < 8) return "Password must be at least 8 characters"; }
  if (!form.department_id) return "Please select a department";
  if (!form.employee_id?.trim()) return "Employee ID is required";
  return null;
}

export default function AdminOfficers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editOfficer, setEditOfficer] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", department_id: "", employee_id: "", designation: "Field Officer" });
  const { mutate, loading: mutLoading } = useApiMutation();

  const { data, loading, refetch } = useApi(
    () => officerApi.list({ page, limit: 15, search: search || undefined }),
    [page]
  );
  const { data: deptData } = useApi(() => departmentApi.list(), []);

  const officers = data?.officers || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 15);
  const departments = deptData?.departments || deptData || [];
  const exportOfficers = () => {
    const rows = officers.map((officer) => ({
      name: officer.name,
      email: officer.email,
      department: officer.department_name || "",
      employee_id: officer.employee_id || "",
      total_assigned: officer.total_assigned || 0,
      resolved_count: officer.resolved_count || 0,
      avg_rating: officer.avg_rating || "",
      is_active: officer.is_active !== false ? "active" : "inactive",
    }));
    const headers = Object.keys(rows[0] || { name: "", email: "", department: "", employee_id: "", total_assigned: "", resolved_count: "", avg_rating: "", is_active: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `officers-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openAdd = () => { setEditOfficer(null); setForm({ name: "", email: "", password: "", phone: "", department_id: "", employee_id: "", designation: "Field Officer" }); setFormError(""); setShowModal(true); };
  const openEdit = (o) => { setEditOfficer(o); setForm({ name: o.name, email: o.email, password: "", phone: o.phone || "", department_id: String(o.department_id || ""), employee_id: o.employee_id || "", designation: o.designation || "Field Officer" }); setFormError(""); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate({ ...form, id: editOfficer?.id });
    if (err) { setFormError(err); return; }
    setFormError("");
    const payload = { ...form, department_id: Number(form.department_id) };
    if (editOfficer) delete payload.password;
    await mutate(
      () => editOfficer ? officerApi.update(editOfficer.id, payload) : officerApi.create(payload),
      () => { setShowModal(false); refetch(); },
      (err) => setFormError(err)
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Deactivate this officer?")) return;
    await mutate(() => officerApi.delete(id), () => refetch(), (err) => alert(err));
  };

  const ratingColor = (r) => r >= 4.5 ? "text-emerald-600" : r >= 4.0 ? "text-blue-600" : r >= 3.5 ? "text-amber-600" : "text-red-500";
  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <Layout role="admin">
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Officer Management</h2>
            <p className="text-muted-foreground mt-1">Manage all active field officers and their assignments.</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm" style={{ background: "hsl(213, 82%, 44%)" }}>
            <Plus className="h-4 w-4" /> Add Officer
          </button>
        </div>
        <div>
          <button onClick={exportOfficers} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Officers", value: total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: officers.filter(o => o.is_active !== false).length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Departments", value: departments.length, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Avg. Rating", value: officers.length > 0 ? (officers.reduce((s, o) => s + (parseFloat(o.avg_rating) || 0), 0) / officers.length).toFixed(1) + " ★" : "N/A", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-xl font-bold text-foreground">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 border-b border-border flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Search officers by name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); refetch(); } }}
              />
            </div>
            <button onClick={() => { setPage(1); refetch(); }} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Officer</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Employee ID</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Assigned</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rating</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {officers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 bg-primary">
                            {officer.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{officer.name}</p>
                            <p className="text-xs text-muted-foreground">{officer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{officer.department_name || "—"}</td>
                      <td className="px-4 py-3.5 text-sm font-mono text-muted-foreground">{officer.employee_id || "—"}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{officer.total_assigned || 0}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600">{officer.resolved_count || 0}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${ratingColor(parseFloat(officer.avg_rating) || 0)}`}>
                          {officer.avg_rating ? `${officer.avg_rating} ★` : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${officer.is_active !== false ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {officer.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(officer)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete(officer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" title="Deactivate">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {officers.length === 0 && (
                    <tr><td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">No officers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium flex items-center justify-between">
            <span>Showing {officers.length} of {total} officers</span>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">{editOfficer ? "Edit Officer" : "Add New Officer"}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Full Name *", key: "name", type: "text", placeholder: "Officer's full name" },
                  { label: "Email *", key: "email", type: "email", placeholder: "official@govcare.gov.in" },
                  ...(!editOfficer ? [{ label: "Password * (min 8 chars)", key: "password", type: "password", placeholder: "••••••••" }] : []),
                  { label: "Employee ID *", key: "employee_id", type: "text", placeholder: "EMP-001" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Designation", key: "designation", type: "text", placeholder: "Field Officer" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} className={inp} value={form[field.key] || ""} onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))} required={field.label.includes("*")} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Department *</label>
                  <select className={inp} value={form.department_id} onChange={(e) => setForm(f => ({ ...f, department_id: e.target.value }))} required>
                    <option value="">Select department</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                  </select>
                </div>
                {formError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
                <div className="flex gap-3 mt-5">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" disabled={mutLoading} className="flex-1 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2" style={{ background: "hsl(213, 82%, 44%)" }}>
                    {mutLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {editOfficer ? "Save Changes" : "Add Officer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
