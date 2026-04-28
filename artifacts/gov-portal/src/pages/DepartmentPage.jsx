import { useMemo, useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { departments } from "@/lib/data";
import { getComplaintCatalog, normalizeComplaintRecord } from "@/lib/complaints";
import { findDepartmentCatalogEntry, getComplaintDepartments } from "@/lib/departmentCatalog";
import { ArrowLeft, FileText, CheckCircle, Clock, BarChart3, Building2, User, ChevronRight, Sparkles, AlertTriangle } from "lucide-react";

const statusStyle = {
  "pending": "bg-amber-50 text-amber-700 border-amber-200",
  "acknowledged": "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  "resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityDot = { low: "bg-slate-400", medium: "bg-sky-500", high: "bg-orange-500", urgent: "bg-red-500" };

export default function DepartmentPage({ params }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const deptId = Number(params.id);
  const catalogDepartments = getComplaintDepartments();
  const dept =
    findDepartmentCatalogEntry(params.id) ||
    findDepartmentCatalogEntry(deptId) ||
    catalogDepartments.find((item) => item.id === deptId) ||
    departments.find((item) => item.id === deptId);
  const deptStats = departments.find((item) => {
    const current = item.name?.toLowerCase();
    if (!current || !dept?.name) return false;
    if (current === dept.name.toLowerCase()) return true;
    return (dept.aliases || []).some((alias) => alias.toLowerCase() === current);
  });
  const complaintSource = getComplaintCatalog().map((item) => normalizeComplaintRecord(item)).filter(Boolean);

  if (!dept) {
    return (
      <Layout role="citizen" userName="Citizen">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="text-lg font-bold text-foreground mb-2">Department Not Found</h3>
          <p className="text-muted-foreground mb-4">The department you're looking for doesn't exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-bold" style={{ background: "hsl(213, 82%, 44%)" }}>
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const deptAliases = [dept.name, ...(dept.aliases || [])].map((value) => String(value).toLowerCase());
  const deptComplaints = complaintSource.filter((complaint) => deptAliases.some((alias) => [complaint.department, complaint.category, complaint.complaintType].map((value) => String(value || "").toLowerCase()).includes(alias)));
  const totalComplaints = deptComplaints.length || deptStats?.complaints || dept.complaints || 0;
  const resolvedComplaints = deptComplaints.filter((complaint) => ["resolved", "closed"].includes(complaint.status)).length || deptStats?.resolved || dept.resolved || 0;
  const pendingComplaints = deptComplaints.filter((complaint) => !["resolved", "closed"].includes(complaint.status)).length || deptStats?.pending || dept.pending || 0;
  const pct = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const complaintTypes = dept.complaintTypes || [];
  const features = dept.features || [];
  const recentComplaints = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deptComplaints
      .filter((complaint) => !statusFilter || complaint.status === statusFilter)
      .filter((complaint) => {
        if (!q) return true;
        const values = [complaint.id, complaint.title, complaint.description, complaint.citizen, complaint.complaintType]
          .map((value) => String(value || "").toLowerCase());
        return values.some((value) => value.includes(q));
      })
      .slice(0, 8);
  }, [deptComplaints, search, statusFilter]);

  return (
    <Layout role="citizen" userName="Citizen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-950">{dept.name}</span>
          </div>
        </div>

        <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="text-6xl mb-4">{dept.icon}</div>
              <h2 className="text-3xl font-bold">{dept.name}</h2>
              <p className="text-blue-100 mt-2 text-lg">Government Department — Civic Services</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {features.slice(0, 4).map((feature) => (
                  <span key={feature} className="rounded-full border border-blue-400/50 bg-blue-500/30 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-blue-100">
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black">{pct}%</div>
              <div className="text-blue-300 text-sm">Resolution Rate</div>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-white/10">
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct >= 85 ? "#10b981" : pct >= 70 ? "#f59e0b" : "#ef4444"
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-300 mt-1.5">
              <span>{resolvedComplaints} resolved</span>
              <span>{pendingComplaints} pending</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Complaints", value: totalComplaints, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Resolved", value: resolvedComplaints, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending", value: pendingComplaints, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Success Rate", value: `${pct}%`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-sky-600" />
              <h3 className="font-bold text-foreground">Complaint Types</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {complaintTypes.map((type) => (
                <span key={type} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  {type}
                </span>
              ))}
            </div>
            {complaintTypes.length === 0 && (
              <p className="text-sm text-muted-foreground">No complaint type list is available for this department yet.</p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-bold text-foreground">Department Functions</h3>
            </div>
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm text-foreground">{feature}</p>
                </div>
              ))}
              {features.length === 0 && <p className="text-sm text-muted-foreground">No function list is available for this department yet.</p>}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Recent Complaints in {dept.name}</h3>
            <span className="text-sm text-muted-foreground">{deptComplaints.length} complaints</span>
          </div>
          <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, ID, citizen..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">All status</option>
              {Object.keys(statusStyle).map((status) => (
                <option key={status} value={status}>{status.replace("-", " ")}</option>
              ))}
            </select>
          </div>
          <div className="divide-y divide-border">
            {recentComplaints.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm font-medium">No complaints filed for this department yet.</p>
                <p className="text-xs mt-1">Be the first to report an issue!</p>
              </div>
            ) : (
              recentComplaints.map((c) => (
                <div key={c.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{c.id}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusStyle[c.status]}`}>
                          {c.status.replace("-", " ")}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-bold capitalize">
                          <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[c.priority]}`} />
                          {c.priority}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{c.citizen}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.date}</span>
                        {c.complaintType && <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" />{c.complaintType}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Link
          href="/citizen/complaint/new"
          className="flex items-center justify-center gap-2.5 py-3.5 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm w-full"
          style={{ background: "hsl(213, 82%, 44%)" }}
        >
          <FileText className="h-4 w-4" />
          File Complaint with {dept.name}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Layout>
  );
}
