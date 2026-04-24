import { statusColors, priorityColors } from "@/lib/data";
import { Clock, User, Building2 } from "lucide-react";

export default function ComplaintCard({ complaint, onClick }) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(complaint)}
      data-testid={`complaint-card-${complaint.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{complaint.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[complaint.status]}`}>
              {complaint.status.replace("-", " ")}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[complaint.priority]}`}>
              {complaint.priority}
            </span>
          </div>
          <h3 className="font-semibold text-foreground mt-1 truncate">{complaint.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          {complaint.department}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {complaint.date}
        </span>
        {complaint.citizen && (
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {complaint.citizen}
          </span>
        )}
      </div>
    </div>
  );
}
