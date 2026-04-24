import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints } from "@/lib/data";
import { FileText, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Bell, TrendingUp } from "lucide-react";

export default function CitizenDashboard() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const myComplaints = complaints.slice(0, 4);

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, Rajesh</h2>
            <p className="text-muted-foreground mt-1">Here's an overview of all your complaints and activity.</p>
          </div>
          <Link
            href="/citizen/complaint/new"
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm"
            style={{ background: "hsl(213, 82%, 44%)" }}
          >
            <Plus className="h-4 w-4" />
            File Complaint
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">Update on CMP-002</p>
            <p className="text-sm text-blue-600 mt-0.5">Your complaint about Street Light has been updated to <strong>In Progress</strong>. Parts have been ordered.</p>
          </div>
          <button className="text-blue-400 hover:text-blue-600 text-xs font-medium shrink-0 ml-auto">Dismiss</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Filed" value="6" icon={FileText} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Pending" value="1" icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          <StatCard title="In Progress" value="2" icon={AlertCircle} color="text-orange-600" bg="bg-orange-50" />
          <StatCard title="Resolved" value="3" icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Recent Complaints</h3>
              <Link href="/citizen/history" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {myComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} onClick={setSelectedComplaint} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: "File New Complaint", icon: FileText, path: "/citizen/complaint/new", color: "text-blue-600 bg-blue-50" },
                  { label: "Track by ID", icon: Clock, path: "/citizen/track", color: "text-amber-600 bg-amber-50" },
                  { label: "View All History", icon: AlertCircle, path: "/citizen/history", color: "text-orange-600 bg-orange-50" },
                  { label: "Update Profile", icon: CheckCircle, path: "/citizen/profile", color: "text-emerald-600 bg-emerald-50" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.path}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className={`p-2 rounded-lg ${action.color.split(" ")[1]}`}>
                        <Icon className={`h-4 w-4 ${action.color.split(" ")[0]}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground flex-1">{action.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-foreground">Resolution Stats</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Avg. Resolution Time", val: "4.2 days" },
                  { label: "Your Rating Given", val: "4.3 / 5 ★" },
                  { label: "Satisfaction Score", val: "87%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-bold text-foreground">{stat.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-card rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{selectedComplaint.id}</span>
                  <h3 className="text-xl font-bold text-foreground mt-2">{selectedComplaint.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedComplaint.description}</p>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors ml-2">
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-medium">Department</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedComplaint.department}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-medium">Filed Date</p>
                  <p className="font-semibold text-foreground mt-0.5">{selectedComplaint.date}</p>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-4">Timeline</h4>
              <div className="space-y-0">
                {selectedComplaint.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === selectedComplaint.timeline.length - 1 ? "bg-primary text-white" : "bg-emerald-100 text-emerald-700"}`}>
                        {i + 1}
                      </div>
                      {i < selectedComplaint.timeline.length - 1 && <div className="w-0.5 h-6 bg-border my-1" />}
                    </div>
                    <div className="pb-4 pt-1">
                      <p className="text-sm font-semibold text-foreground capitalize">{t.status.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.note}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selectedComplaint.rating && (
                <div className="mt-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="text-sm font-semibold text-emerald-800">
                    Your Rating: {"★".repeat(selectedComplaint.rating)}{"☆".repeat(5 - selectedComplaint.rating)}
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">{selectedComplaint.feedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
