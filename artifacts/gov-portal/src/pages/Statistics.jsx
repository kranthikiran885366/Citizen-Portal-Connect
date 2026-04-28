import { BarChart3 } from "lucide-react";
import PublicStatisticsDashboard from "@/components/PublicStatisticsDashboard";

export default function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Platform Statistics</h1>
          </div>
          <p className="text-blue-100 text-lg">Real-time metrics on complaint resolution, department performance, and citizen satisfaction</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        <PublicStatisticsDashboard />
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 border-t border-slate-200 mt-12 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-bold text-slate-950 mb-4">About These Statistics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-slate-950 mb-2">🎯 Complaint Tracking</h4>
              <p className="text-sm text-slate-600">We track all complaints from filing to resolution, ensuring transparency in the process.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-950 mb-2">⚡ Real-Time Updates</h4>
              <p className="text-sm text-slate-600">Statistics are updated every 5 minutes to reflect the most current data.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-950 mb-2">📊 Performance Metrics</h4>
              <p className="text-sm text-slate-600">Department performance is measured by resolution rates, response times, and citizen satisfaction.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
