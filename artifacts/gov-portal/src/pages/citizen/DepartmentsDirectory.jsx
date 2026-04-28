import { useMemo, useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { getComplaintDepartments } from "@/lib/departmentCatalog";
import { ArrowRight, Building2, ClipboardList, Sparkles } from "lucide-react";

export default function DepartmentsDirectory() {
  const [search, setSearch] = useState("");
  const departments = getComplaintDepartments();
  const filteredDepartments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter((department) => {
      const haystack = [department.name, ...(department.complaintTypes || []), ...(department.features || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [departments, search]);

  return (
    <Layout role="citizen">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> 15 Departments
          </div>
          <h2 className="text-3xl font-bold text-slate-950">📋 Department & Service Directory</h2>
          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Browse all government departments, complaint types, and available services before filing your complaint.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="🔍 Search departments, types, or services..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDepartments.map((department) => (
            <div key={department.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-4xl mb-3">{department.icon}</div>
                  <h3 className="text-lg font-bold text-slate-950">{department.name}</h3>
                </div>
                <Link
                  href={`/department/${department.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100"
                >
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-2.5">
                    Complaint Types ({department.complaintTypes.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {department.complaintTypes.slice(0, 3).map((type) => (
                      <span key={type} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {type}
                      </span>
                    ))}
                    {department.complaintTypes.length > 3 && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        +{department.complaintTypes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-2.5">
                    Services ({department.features.length})
                  </p>
                  <div className="space-y-1.5">
                    {department.features.slice(0, 2).map((feature) => (
                      <div key={feature} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                        <span className="mt-0.5 text-slate-400">✓</span>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                    {department.features.length > 2 && (
                      <p className="text-xs text-slate-500 font-medium px-3 py-1">+{department.features.length - 2} more services</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredDepartments.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-600">No departments found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            href="/citizen/complaint/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30"
          >
            <ClipboardList className="h-4 w-4" /> 📝 File Complaint
          </Link>
        </div>
      </div>
    </Layout>
  );
}
