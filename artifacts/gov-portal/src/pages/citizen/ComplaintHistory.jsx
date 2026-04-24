import { useState } from "react";
import Layout from "@/components/Layout";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints, statusColors } from "@/lib/data";
import { Search, Filter } from "lucide-react";

export default function ComplaintHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRate = (c) => setSelected(c);

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Complaint History</h2>
          <p className="text-sm text-muted-foreground">All your submitted complaints</p>
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
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "in-progress", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                  statusFilter === s ? "bg-primary text-white border-primary" : "bg-background border-input text-foreground hover:border-primary"
                }`}
                data-testid={`filter-${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">No complaints found</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div key={c.id}>
                <ComplaintCard complaint={c} onClick={setSelected} />
                {c.status === "resolved" && !c.rating && (
                  <div className="mt-1 ml-4">
                    <button
                      onClick={() => setSelected(c)}
                      className="text-xs text-primary hover:underline"
                    >
                      Rate & give feedback
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xl">&times;</button>
            </div>
            {selected.status === "resolved" && !selected.rating ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">How satisfied are you with the resolution?</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`text-2xl transition-transform hover:scale-110 ${rating >= r ? "text-yellow-400" : "text-gray-300"}`}
                      data-testid={`star-${r}`}
                    >★</button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-3"
                  placeholder="Share your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  data-testid="textarea-feedback"
                />
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                  data-testid="button-submit-rating"
                >
                  Submit Feedback
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">{selected.description}</p>
                <div className="space-y-2 text-sm">
                  {selected.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <span className="font-medium capitalize">{t.status}</span>
                        <span className="text-muted-foreground"> — {t.note} ({t.date})</span>
                      </div>
                    </div>
                  ))}
                </div>
                {selected.rating && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                    Rating: {"★".repeat(selected.rating)}{"☆".repeat(5-selected.rating)} — {selected.feedback}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
