import Layout from "@/components/Layout";
import { departments } from "@/lib/data";
import { TrendingUp, TrendingDown, Building2, Search } from "lucide-react";
import { useState } from "react";

export default function AdminDepartments() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rate");

  const filtered = departments
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "rate") return (b.resolved / b.complaints) - (a.resolved / a.complaints);
      if (sort === "total") return b.complaints - a.complaints;
      if (sort === "pending") return b.pending - a.pending;
      return 0;
    });

  const totalComplaints = departments.reduce((s, d) => s + d.complaints, 0);
  const totalResolved = departments.reduce((s, d) => s + d.resolved, 0);
  const totalPending = departments.reduce((s, d) => s + d.pending, 0);
  const avgRate = Math.round((totalResolved / totalComplaints) * 100);

  return (
    <Layout role="admin" userName="Admin">
      <div className="space-y-5 max-w-6xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Department Management</h2>
          <p className="text-muted-foreground mt-1">Monitor performance and complaint load across all 15 government departments.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Departments", value: departments.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Complaints", value: totalComplaints.toLocaleString(), color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Total Resolved", value: totalResolved.toLocaleString(), color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Avg. Resolution Rate", value: `${avgRate}%`, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary transition-all"
                placeholder="Search departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary font-medium"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rate">Sort by Resolution Rate</option>
              <option value="total">Sort by Total Complaints</option>
              <option value="pending">Sort by Pending</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolved</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pending</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Resolution Rate</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((dept, i) => {
                  const pct = Math.round((dept.resolved / dept.complaints) * 100);
                  const isGood = pct >= 85;
                  return (
                    <tr key={dept.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-bold text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{dept.icon}</span>
                          <span className="text-sm font-semibold text-foreground">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-foreground">{dept.complaints}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600">{dept.resolved}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${dept.pending > 40 ? "text-red-500" : dept.pending > 20 ? "text-amber-600" : "text-emerald-600"}`}>
                          {dept.pending}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444" }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${pct >= 90 ? "text-emerald-600" : pct >= 75 ? "text-amber-600" : "text-red-500"}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {isGood
                          ? <TrendingUp className="h-4 w-4 text-emerald-500" />
                          : <TrendingDown className="h-4 w-4 text-red-500" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
