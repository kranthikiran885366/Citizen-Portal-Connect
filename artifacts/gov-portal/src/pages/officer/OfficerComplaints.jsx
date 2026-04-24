import { useState } from "react";
import Layout from "@/components/Layout";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints, statusColors, priorityColors } from "@/lib/data";
import { Search, CheckSquare, Square, Filter } from "lucide-react";

export default function OfficerComplaints() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(c => c.id));
  };

  const handleBulkAction = () => {
    setSelected([]);
    setBulkAction("");
  };

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Assigned Complaints</h2>
          <p className="text-sm text-muted-foreground">{complaints.length} total complaints</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <select
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            data-testid="select-status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            data-testid="select-priority-filter"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <span className="text-sm font-medium text-primary">{selected.length} selected</span>
            <select
              className="flex-1 px-3 py-1.5 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              data-testid="select-bulk-action"
            >
              <option value="">Bulk Action...</option>
              <option value="acknowledge">Mark Acknowledged</option>
              <option value="in-progress">Mark In Progress</option>
              <option value="resolve">Mark Resolved</option>
            </select>
            <button
              onClick={handleBulkAction}
              className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-bulk-apply"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={selectAll} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            {selected.length === filtered.length && filtered.length > 0 ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
            {selected.length === filtered.length && filtered.length > 0 ? "Deselect All" : "Select All"}
          </button>
          <span>({filtered.length} results)</span>
        </div>

        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="flex gap-3">
              <button
                onClick={() => toggleSelect(c.id)}
                className="mt-1 shrink-0"
                data-testid={`checkbox-${c.id}`}
              >
                {selected.includes(c.id) ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-muted-foreground hover:text-foreground" />}
              </button>
              <div className="flex-1">
                <ComplaintCard complaint={c} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
