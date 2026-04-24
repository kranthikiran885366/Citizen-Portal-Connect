import { Link } from "wouter";
import Layout from "@/components/Layout";
import { departments, complaints, statusColors } from "@/lib/data";
import { ArrowLeft, FileText, CheckCircle, Clock, BarChart3 } from "lucide-react";

export default function DepartmentPage({ params }) {
  const deptId = parseInt(params.id);
  const dept = departments.find(d => d.id === deptId);

  if (!dept) {
    return (
      <Layout role="citizen" userName="Citizen">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Department not found</p>
          <Link href="/" className="text-primary hover:underline mt-2 block">Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const deptComplaints = complaints.filter(c => c.department === dept.name);
  const pct = Math.round((dept.resolved / dept.complaints) * 100);

  const stats = [
    { label: "Total Complaints", val: dept.complaints, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", val: dept.resolved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", val: dept.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Resolution Rate", val: `${pct}%`, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <Layout role="citizen" userName="Citizen">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-foreground">{dept.icon} {dept.name}</h2>
            <p className="text-sm text-muted-foreground">Department Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">{item.label}</p>
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{item.val}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Overall Resolution Progress</h3>
            <span className="text-sm font-bold text-green-600">{pct}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${pct >= 85 ? "bg-green-500" : pct >= 70 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{dept.resolved} resolved</span>
            <span>{dept.pending} pending</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Complaints in this Department</h3>
          {deptComplaints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No complaints filed for this department yet.</p>
          ) : (
            <div className="space-y-3">
              {deptComplaints.map((c) => (
                <div key={c.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.date} • {c.citizen}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/citizen/complaint/new"
          className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors w-full"
          data-testid="button-file-complaint"
        >
          <FileText className="h-4 w-4" />
          File Complaint with {dept.name}
        </Link>
      </div>
    </Layout>
  );
}
