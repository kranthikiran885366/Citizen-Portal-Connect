import { Clock, User, Building2, ChevronRight } from "lucide-react";

const statusStyle = {
  "pending": "bg-amber-50 text-amber-700 border-amber-200",
  "acknowledged": "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-orange-50 text-orange-700 border-orange-200",
  "resolved": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "closed": "bg-gray-50 text-gray-600 border-gray-200",
};

const priorityStyle = {
  "low": "bg-slate-50 text-slate-600 border-slate-200",
  "medium": "bg-sky-50 text-sky-700 border-sky-200",
  "high": "bg-orange-50 text-orange-700 border-orange-200",
  "urgent": "bg-red-50 text-red-700 border-red-200",
};

const priorityDot = {
  "low": "bg-slate-400",
  "medium": "bg-sky-500",
  "high": "bg-orange-500",
  "urgent": "bg-red-500",
};

export default function ComplaintCard({ complaint, onClick }) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
      onClick={() => onClick && onClick(complaint)}
      data-testid={`complaint-card-${complaint.id}`}
    >
      <div className="h-1.5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-mono font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{complaint.id}</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[complaint.status]}`}>
                {complaint.status.replace("-", " ")}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyle[complaint.priority]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[complaint.priority]}`} />
                {complaint.priority}
              </span>
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-[15px] leading-snug">{complaint.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{complaint.description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            {complaint.department}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {complaint.date}
          </span>
          {complaint.citizen && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {complaint.citizen}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
