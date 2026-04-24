import { useState } from "react";
import Layout from "@/components/Layout";
import { complaints, statusColors, priorityColors } from "@/lib/data";
import { Search, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

const statusIcons = {
  submitted: FileText,
  acknowledged: Clock,
  "in-progress": AlertCircle,
  resolved: CheckCircle,
};

export default function TrackStatus() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const c = complaints.find(c => c.id.toLowerCase() === query.trim().toLowerCase());
    setFound(c || null);
  };

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Track Complaint Status</h2>
          <p className="text-sm text-muted-foreground">Enter your complaint ID to check real-time status</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2.5 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter Complaint ID (e.g. CMP-001)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid="input-complaint-id"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-search"
          >
            <Search className="h-4 w-4" />
            Track
          </button>
        </form>

        <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2 text-foreground">Try these sample IDs:</p>
          <div className="flex flex-wrap gap-2">
            {complaints.map(c => (
              <button
                key={c.id}
                onClick={() => setQuery(c.id)}
                className="px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-mono hover:border-primary hover:text-primary transition-colors"
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {searched && !found && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700 font-medium">Complaint not found</p>
            <p className="text-sm text-red-500 mt-1">Please check the ID and try again</p>
          </div>
        )}

        {found && (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{found.id}</p>
                  <h3 className="font-bold text-foreground text-lg mt-0.5">{found.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{found.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[found.status]}`}>
                    {found.status.replace("-", " ")}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[found.priority]}`}>
                    {found.priority}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium text-foreground">{found.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Filed Date</p>
                  <p className="font-medium text-foreground">{found.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Officer</p>
                  <p className="font-medium text-foreground">{found.officer || "Not yet assigned"}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-foreground mb-4">Progress Timeline</h4>
              <div className="space-y-0">
                {found.timeline.map((t, i) => {
                  const Icon = statusIcons[t.status] || Clock;
                  const isLast = i === found.timeline.length - 1;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isLast ? "bg-primary text-white" : "bg-green-100 text-green-700"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && <div className="w-0.5 bg-border flex-1 my-1" style={{ minHeight: "20px" }} />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-semibold text-foreground capitalize">{t.status.replace("-", " ")}</p>
                        <p className="text-sm text-muted-foreground">{t.note}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {found.rating && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Rated: {"★".repeat(found.rating)}{"☆".repeat(5-found.rating)}
                  </p>
                  <p className="text-sm text-green-700">{found.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
