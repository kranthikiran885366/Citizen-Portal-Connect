import { useState } from "react";
import Layout from "@/components/Layout";
import { departmentApi } from "@/lib/api";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { TrendingUp, TrendingDown, Search, Plus, Edit, Trash2, LoaderCircle } from "lucide-react";

function validate(form) {
  if (!form.name?.trim() || form.name.trim().length < 2) return "Department name must be at least 2 characters";
  if (form.sla_days && (isNaN(form.sla_days) || Number(form.sla_days) < 1)) return "SLA days must be a positive number";
  return null;
}

export default function AdminDepartments() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rate");
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", icon: "🏛️", description: "", head_name: "", contact_email: "", contact_phone: "", sla_days: 7 });
  const { mutate, loading: mutLoading } = useApiMutation();

  const { data, loading, refetch } = useApi(() => departmentApi.list(), []);
  const departments = data?.departments || data || [];

  const filtered = departments
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aTotal = a.total_complaints || a.complaints || 0;
      const bTotal = b.total_complaints || b.complaints || 0;
      const aResolved = a.resolved_complaints || a.resolved || 0;
      const bResolved = b.resolved_complaints || b.resolved || 0;
      if (sort === "rate") return (bTotal > 0 ? bResolved / bTotal : 0) - (aTotal > 0 ? aResolved / aTotal : 0);
      if (sort === "total") return bTotal - aTotal;
      if (sort === "pending") return (b.pending_complaints || b.pending || 0) - (a.pending_complaints || a.pending || 0);
      return 0;
    });

  const totalComplaints = departments.reduce((s, d) => s + (d.total_complaints || d.complaints || 0), 0);
  const totalResolved = departments.reduce((s, d) => s + (d.resolved_complaints || d.resolved || 0), 0);
  const avgRate = totalComplaints > 0 ? Math.round((totalResolved / totalComplaints) * 100) : 0;
  const exportDepartments = () => {
    const rows = filtered.map((department) => ({
      name: department.name,
      total: department.total_complaints || department.complaints || 0,
      resolved: department.resolved_complaints || department.resolved || 0,
      pending: department.pending_complaints || department.pending || 0,
      sla_days: department.sla_days || 7,
    }));
    const headers = Object.keys(rows[0] || { name: "", total: "", resolved: "", pending: "", sla_days: "" });
    const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "departments-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openAdd = () => { setEditDept(null); setForm({ name: "", icon: "🏛️", description: "", head_name: "", contact_email: "", contact_phone: "", sla_days: 7 }); setFormError(""); setShowModal(true); };
  const openEdit = (d) => { setEditDept(d); setForm({ name: d.name, icon: d.icon || "🏛️", description: d.description || "", head_name: d.head_name || "", contact_email: d.contact_email || "", contact_phone: d.contact_phone || "", sla_days: d.sla_days || 7 }); setFormError(""); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setFormError(err); return; }
    setFormError("");
    const payload = { ...form, sla_days: Number(form.sla_days) };
    await mutate(
      () => editDept ? departmentApi.update(editDept.id, payload) : departmentApi.create(payload),
      () => { setShowModal(false); refetch(); },
      (err) => setFormError(err)
    );
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department? This may affect existing complaints.")) return;
    await mutate(() => departmentApi.delete(id), () => refetch(), (err) => alert(err));
  };

  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <Layout role="admin">
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Department Management</h2>
            <p className="text-muted-foreground mt-1">Monitor performance and complaint load across all government departments.</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm" style={{ background: "hsl(213, 82%, 44%)" }}>
            <Plus className="h-4 w-4" /> Add Department
          </button>
        </div>
        <div>
          <button onClick={exportDepartments} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Departments", value: departments.length, color: "text-blue-600" },
            { label: "Total Complaints", value: totalComplaints.toLocaleString(), color: "text-indigo-600" },
            { label: "Total Resolved", value: totalResolved.toLocaleString(), color: "text-emerald-600" },
            { label: "Avg. Resolution Rate", value: `${avgRate}%`, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{loading ? "—" : s.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-all" placeholder="Search departments..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary font-medium" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rate">Sort by Resolution Rate</option>
              <option value="total">Sort by Total Complaints</option>
              <option value="pending">Sort by Pending</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pending</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">SLA Days</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolution Rate</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Trend</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((dept, i) => {
                    const total = dept.total_complaints || dept.complaints || 0;
                    const resolved = dept.resolved_complaints || dept.resolved || 0;
                    const pending = dept.pending_complaints || dept.pending || 0;
                    const pct = total > 0 ? Math.round((resolved / total) * 100) : 0;
                    return (
                      <tr key={dept.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3.5 text-sm font-bold text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{dept.icon || "🏛️"}</span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                              {dept.head_name && <p className="text-xs text-muted-foreground">{dept.head_name}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{total}</td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600">{resolved}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-bold ${pending > 40 ? "text-red-500" : pending > 20 ? "text-amber-600" : "text-emerald-600"}`}>{pending}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted-foreground">{dept.sla_days || 7}d</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-20 h-2.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444" }} />
                            </div>
                            <span className={`text-sm font-bold ${pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {pct >= 85 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDelete(dept.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && <tr><td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">No departments found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">{editDept ? "Edit Department" : "Add Department"}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Department Name *</label>
                    <input type="text" className={inp} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. Water Supply" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Icon (emoji)</label>
                    <input type="text" className={inp} value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🏛️" maxLength={4} />
                  </div>
                </div>
                {[
                  { label: "Description", key: "description", type: "text", placeholder: "Brief description" },
                  { label: "Head Name", key: "head_name", type: "text", placeholder: "Department head" },
                  { label: "Contact Email", key: "contact_email", type: "email", placeholder: "dept@govcare.gov.in" },
                  { label: "Contact Phone", key: "contact_phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input type={field.type} className={inp} value={form[field.key]} onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">SLA Days (default resolution target)</label>
                  <input type="number" className={inp} value={form.sla_days} min={1} max={365} onChange={(e) => setForm(f => ({ ...f, sla_days: e.target.value }))} />
                </div>
                {formError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>}
                <div className="flex gap-3 mt-5">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" disabled={mutLoading} className="flex-1 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2" style={{ background: "hsl(213, 82%, 44%)" }}>
                    {mutLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {editDept ? "Save Changes" : "Add Department"}
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
