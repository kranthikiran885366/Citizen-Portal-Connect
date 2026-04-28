import { useState } from "react";
import { Search, X, Download, Filter, ChevronRight } from "lucide-react";
import { advancedApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department_id: "",
    status: "",
    priority: "",
    date_from: "",
    date_to: "",
    sla_breach: false,
  });
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && Object.values(filters).every(f => !f)) {
      return;
    }

    setSearching(true);
    try {
      const response = await advancedApi.search(query, filters, page, 20);
      setResults(response.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setSearching(false);
  };

  const handleExport = async (format) => {
    try {
      const response = await advancedApi.exportComplaints(format, filters);
      // Handle CSV/JSON download
      if (format === "csv") {
        const blob = new Blob([response], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `complaints-${Date.now()}.csv`;
        a.click();
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950 mb-4">🔍 Advanced Search</h3>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaints, IDs, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-all"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button
              type="submit"
              disabled={searching}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-60"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {showFilters && (
            <div className="grid gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.sla_breach}
                  onChange={(e) => setFilters({ ...filters, sla_breach: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-red-600"
                />
                SLA Breached Only
              </label>
            </div>
          )}
        </form>

        {results.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-950 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-950">Results ({results.length})</h4>
          {results.map((complaint) => (
            <div key={complaint.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-slate-500 mb-1">{complaint.complaint_number}</p>
                  <p className="font-semibold text-slate-950">{complaint.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{complaint.department_name}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                    complaint.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' :
                    complaint.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    complaint.status === 'in-progress' ? 'bg-orange-50 text-orange-700' :
                    'bg-slate-50 text-slate-700'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
