import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, color = "text-primary", bg = "bg-blue-50", change, subtitle, border = "border-l-blue-500" }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground leading-none mt-2">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {change >= 0 ? "+" : ""}{change}% vs last month
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-2xl ${bg} shrink-0 ring-1 ring-black/5`}>
              <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.75} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
