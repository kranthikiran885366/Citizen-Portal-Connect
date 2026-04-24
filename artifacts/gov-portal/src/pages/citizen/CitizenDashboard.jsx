import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints } from "@/lib/data";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from "lucide-react";

export default function CitizenDashboard() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const myComplaints = complaints.slice(0, 4);

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Welcome back, Rajesh!</h2>
            <p className="text-sm text-muted-foreground">Here is an overview of your complaints</p>
          </div>
          <Link
            href="/citizen/complaint/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-new-complaint"
          >
            <Plus className="h-4 w-4" />
            New Complaint
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total Filed" value="6" icon={FileText} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Pending" value="1" icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard title="In Progress" value="2" icon={AlertCircle} color="text-orange-600" bg="bg-orange-50" />
          <StatCard title="Resolved" value="3" icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Complaints</h3>
            <Link
              href="/citizen/history"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myComplaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} onClick={setSelectedComplaint} />
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "File Complaint", icon: FileText, path: "/citizen/complaint/new" },
              { label: "Track Status", icon: Clock, path: "/citizen/track" },
              { label: "My History", icon: AlertCircle, path: "/citizen/history" },
              { label: "My Profile", icon: CheckCircle, path: "/citizen/profile" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.path}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors text-center"
                  data-testid={`quick-action-${action.label.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="h-5 w-5" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-card rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{selectedComplaint.id}</p>
                  <h3 className="text-lg font-bold text-foreground">{selectedComplaint.title}</h3>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selectedComplaint.description}</p>
              <h4 className="font-semibold text-foreground mb-3">Timeline</h4>
              <div className="space-y-3">
                {selectedComplaint.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mt-0.5 shrink-0" />
                      {i < selectedComplaint.timeline.length - 1 && <div className="w-0.5 bg-border flex-1 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-medium text-foreground capitalize">{t.status.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground">{t.note}</p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedComplaint.rating && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Your Rating: {"★".repeat(selectedComplaint.rating)}{"☆".repeat(5-selectedComplaint.rating)}</p>
                  <p className="text-sm text-green-700 mt-1">{selectedComplaint.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
