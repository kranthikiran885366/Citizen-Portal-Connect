export default function StatCard({ title, value, icon: Icon, color = "text-primary", bg = "bg-accent", change, subtitle }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
              {change >= 0 ? "+" : ""}{change}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        )}
      </div>
    </div>
  );
}
