import { useEffect, useState } from "react";
import { TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import { advancedApi } from "@/lib/api";

export default function PublicStatisticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStatistics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await advancedApi.getPublicStatistics();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  const metrics = [
    {
      label: "Total Complaints",
      value: stats.total_complaints,
      icon: TrendingUp,
      color: "from-blue-100 to-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "from-emerald-100 to-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "from-amber-100 to-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      icon: TrendingUp,
      color: "from-orange-100 to-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-slate-950 mb-4">📊 Live Complaint Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`rounded-2xl bg-gradient-to-br ${metric.color} border border-slate-200 p-6 shadow-sm`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${metric.color}`}>
                    <Icon className={`h-5 w-5 ${metric.textColor}`} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
                    {metric.label}
                  </p>
                </div>
                <p className="text-3xl font-bold text-slate-950">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resolution Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Resolution Rate</h3>
          <div className="relative h-40 flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={`${stats.resolution_rate * 282.7 / 100} 282.7`}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-bold text-slate-950">{stats.resolution_rate}%</p>
              <p className="text-xs text-slate-600">Resolved</p>
            </div>
          </div>
        </div>

        {/* Average Resolution Time */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Avg Resolution Time</h3>
          <div className="flex items-end gap-2">
            {[25, 40, 35, 50, 45, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t h-16" style={{ height: `${(h / 60) * 100}%` }} />
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-2xl font-bold text-slate-950">{stats.average_resolution_time}</p>
            <p className="text-xs text-slate-600">hours (average)</p>
          </div>
        </div>

        {/* Citizen Satisfaction */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Citizen Satisfaction</h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  star <= Math.round(stats.citizen_satisfaction)
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-3xl font-bold text-slate-950">{stats.citizen_satisfaction}/5.0</p>
          <p className="text-xs text-slate-600 mt-2">Based on {stats.total_complaints} feedback responses</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950 mb-4">Department Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Department</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Total</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Resolved</th>
                <th className="text-left py-2 px-3 font-semibold text-slate-700">Resolution %</th>
              </tr>
            </thead>
            <tbody>
              {stats.department_breakdown.map((dept) => {
                const rate = dept.count > 0 ? Math.round((dept.resolved / dept.count) * 100) : 0;
                return (
                  <tr key={dept.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-3 text-slate-950 font-medium">{dept.name}</td>
                    <td className="py-3 px-3 text-slate-600">{dept.count}</td>
                    <td className="py-3 px-3 text-slate-600">{dept.resolved}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-950">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-slate-600 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p>Data updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
