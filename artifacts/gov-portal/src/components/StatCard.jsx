import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, color = "text-primary", bg = "bg-blue-50", change, subtitle, border = "border-l-blue-500" }) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden`}>
      <div className={`h-1 w-full ${bg.replace("bg-", "bg-").replace("-50", "-500").replace("-100", "-500")}`} style={{ background: "currentColor", opacity: 0 }} />
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
            <div className={`p-3 rounded-xl ${bg} shrink-0`}>
              <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.75} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
