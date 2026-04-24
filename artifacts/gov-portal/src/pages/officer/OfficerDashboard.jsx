import { useState } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints, statusColors, priorityColors } from "@/lib/data";
import { ClipboardList, CheckCircle, AlertTriangle, Clock, Filter, Upload } from "lucide-react";

export default function OfficerDashboard() {
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [note, setNote] = useState("");
  const [updated, setUpdated] = useState(false);

  const myComplaints = complaints.filter(c => c.officer === "Suresh Singh" || c.officer === "Anil Verma" || !c.officer);

  const handleUpdate = () => {
    setUpdated(true);
    setTimeout(() => { setUpdated(false); setSelected(null); }, 2000);
  };

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Officer Dashboard</h2>
          <p className="text-sm text-muted-foreground">Department: Infrastructure | Badge: OFF-0042</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Assigned" value="12" icon={ClipboardList} color="text-blue-600" bg="bg-blue-50" />
          <StatCard title="Resolved" value="10" icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
          <StatCard title="Pending" value="2" icon={Clock} color="text-yellow-600" bg="bg-yellow-50" />
          <StatCard title="SLA Breaches" value="0" icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Assigned Complaints</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{myComplaints.length} total</span>
            </div>
            <div className="space-y-3">
              {myComplaints.map((c) => (
                <ComplaintCard key={c.id} complaint={c} onClick={setSelected} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3">Today's Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Reviewed", val: 5, color: "text-blue-600" },
                  { label: "Updated", val: 3, color: "text-orange-600" },
                  { label: "Closed", val: 2, color: "text-green-600" },
                  { label: "Escalated", val: 0, color: "text-red-600" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <h3 className="font-semibold text-orange-800">SLA Alert</h3>
              </div>
              <p className="text-sm text-orange-700">CMP-003 approaching SLA deadline (2 hours left)</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3">Resolution Rate</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">This Month</span>
                  <span className="text-xs font-bold text-green-600">83%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "83%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground">{selected.id}</p>
                  <h3 className="font-bold text-foreground">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground text-xl">&times;</button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Update Status</label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    data-testid="select-status"
                  >
                    <option value="">Select new status</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Add Note</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Internal note or update..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    data-testid="textarea-note"
                  />
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Upload proof of resolution</p>
                </div>
              </div>

              {updated && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center mb-3">
                  Updated successfully!
                </div>
              )}
              <button
                onClick={handleUpdate}
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                data-testid="button-update-status"
              >
                Update Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
