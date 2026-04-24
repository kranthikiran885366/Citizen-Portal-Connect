import { useState } from "react";
import Layout from "@/components/Layout";
import { officers } from "@/lib/data";
import { Search, Plus, Edit, Trash2, Star, ChevronDown, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function AdminOfficers() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editOfficer, setEditOfficer] = useState(null);
  const [newOfficer, setNewOfficer] = useState({ name: "", department: "", email: "", phone: "" });

  const filtered = officers.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.department.toLowerCase().includes(search.toLowerCase())
  );

  const ratingColor = (r) => r >= 4.5 ? "text-emerald-600" : r >= 4.0 ? "text-blue-600" : r >= 3.5 ? "text-amber-600" : "text-red-500";

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5 max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Officer Management</h2>
            <p className="text-muted-foreground mt-1">Manage all active field officers and their assignments.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: "hsl(213, 82%, 44%)" }}
          >
            <Plus className="h-4 w-4" /> Add Officer
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Officers", value: officers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Today", value: officers.length - 1, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Avg. Rating", value: (officers.reduce((s, o) => s + o.rating, 0) / officers.length).toFixed(1) + " ★", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "SLA Breaches", value: "2", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
                <div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
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
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Officer</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Assigned</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pending</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Efficiency</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((officer) => {
                  const eff = Math.round((officer.resolved / officer.assigned) * 100);
                  return (
                    <tr key={officer.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 bg-primary">
                            {officer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{officer.name}</p>
                            <p className="text-xs text-muted-foreground">ID: OFF-{String(officer.id).padStart(3, "0")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-foreground">{officer.department}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{officer.assigned}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600">{officer.resolved}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-amber-600">{officer.pending}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${ratingColor(officer.rating)}`}>{officer.rating} ★</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${eff}%`, background: eff >= 85 ? "#10b981" : eff >= 70 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className="text-xs font-bold text-foreground">{eff}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setEditOfficer(officer)} className="p-1.5 rounded-lg hover:bg-blue-50 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors" title="Remove">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground font-medium">
            Showing {filtered.length} of {officers.length} officers
          </div>
        </div>
      </div>

      {(showAdd || editOfficer) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { setShowAdd(false); setEditOfficer(null); }}>
          <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-foreground">{editOfficer ? "Edit Officer" : "Add New Officer"}</h3>
                <button onClick={() => { setShowAdd(false); setEditOfficer(null); }} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">✕</button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Enter officer's full name" },
                  { label: "Department", key: "department", type: "text", placeholder: "Assigned department" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "official@govcare.gov.in" },
                  { label: "Mobile Number", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      defaultValue={editOfficer ? editOfficer[field.key] : ""}
                      className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowAdd(false); setEditOfficer(null); }} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button className="flex-1 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: "hsl(213, 82%, 44%)" }}>
                  {editOfficer ? "Save Changes" : "Add Officer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
