import { Link } from "wouter";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ComplaintCard from "@/components/ComplaintCard";
import { complaints } from "@/lib/data";
import { ClipboardList, CheckCircle, AlertTriangle, Clock, ArrowRight, TrendingUp, Star } from "lucide-react";

const assigned = complaints;
const resolved = complaints.filter(c => c.status === "resolved");
const pending = complaints.filter(c => c.status === "pending");
const inProgress = complaints.filter(c => c.status === "in-progress");

export default function OfficerDashboard() {
  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="space-y-6 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Good morning, Suresh</h2>
          <p className="text-muted-foreground mt-1">Infrastructure Department — here's your workload overview for today.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assigned" value={assigned.length} icon={ClipboardList} color="text-blue-600" bg="bg-blue-50" change={5} />
          <StatCard title="Resolved" value={resolved.length} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" change={12} />
          <StatCard title="In Progress" value={inProgress.length} icon={Clock} color="text-orange-600" bg="bg-orange-50" />
          <StatCard title="SLA Breaches" value="1" icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Today's Targets</h3>
            <div className="space-y-3">
              {[
                { label: "Complaints to resolve", target: 3, done: 1, color: "bg-primary" },
                { label: "Pending acknowledgements", target: 2, done: 2, color: "bg-emerald-500" },
                { label: "SLA reviews", target: 4, done: 2, color: "bg-amber-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">{item.done}/{item.target}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.done / item.target) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> My Performance
            </h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Resolution Rate", val: "83%", color: "text-emerald-600" },
                { label: "Avg. Resolution Time", val: "3.2 days", color: "text-blue-600" },
                { label: "Citizen Rating", val: "4.5 ★", color: "text-amber-600" },
                { label: "SLA Compliance", val: "92%", color: "text-purple-600" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "View All Complaints", path: "/officer/complaints", icon: ClipboardList },
                { label: "Check SLA Status", path: "/officer/sla", icon: AlertTriangle },
                { label: "Performance Report", path: "/officer/performance", icon: Star },
                { label: "My Profile", path: "/officer/profile", icon: Clock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium text-foreground flex-1">{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Recent Assigned Complaints</h3>
            <Link href="/officer/complaints" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {assigned.slice(0, 3).map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
