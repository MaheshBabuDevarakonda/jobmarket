import { useState } from "react";

const STATUS_STYLES = {
  "Pending":     "text-yellow-600 bg-yellow-50 border-yellow-200",
  "In Progress": "text-blue-600 bg-blue-50 border-blue-200",
  "Completed":   "text-green-600 bg-green-50 border-green-200",
  "Cancelled":   "text-red-600 bg-red-50 border-red-200",
};

const PRIORITY_STYLES = {
  Low:      "text-green-600",
  Medium:   "text-amber-600",
  High:     "text-orange-600",
  Critical: "text-red-600",
};

const PRIORITY_BARS = { Low: 1, Medium: 2, High: 3, Critical: 4 };

const JobCard = ({ job, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    setDeleting(true);
    await onDelete(job._id);
    setDeleting(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="card group hover:border-slate-300 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10 relative overflow-hidden animate-fade-in-up">
      {/* Priority bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          job.priority === "Critical" ? "bg-red-500" :
          job.priority === "High" ? "bg-orange-500" :
          job.priority === "Medium" ? "bg-amber-500" : "bg-green-500"
        }`}
      />

      <div className="pl-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-700 text-lg text-slate-900 uppercase tracking-wide leading-tight truncate">
              {job.title}
            </h3>
            <p className="text-slate-500 text-xs font-mono mt-0.5">
              #{job._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <span className={`text-xs font-bold uppercase px-2 py-1 border shrink-0 rounded-md ${STATUS_STYLES[job.status]}`}>
            {job.status}
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Work Type</p>
            <p className="text-slate-700 text-sm font-medium mt-0.5">{job.workType}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Location</p>
            <p className="text-slate-700 text-sm font-medium mt-0.5 truncate">{job.location}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Date</p>
            <p className="text-slate-700 text-sm font-medium mt-0.5">{formatDate(job.date)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Workers</p>
            <p className="text-slate-700 text-sm font-medium mt-0.5 flex items-center gap-1">
              <span className="text-amber-500">◈</span> {job.workers}
            </p>
          </div>
        </div>

        {/* Priority + Hours */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Priority:</span>
            <div className="flex items-center gap-1">
              {[1,2,3,4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= PRIORITY_BARS[job.priority]
                      ? (job.priority === "Critical" ? "bg-red-500" :
                         job.priority === "High" ? "bg-orange-500" :
                         job.priority === "Medium" ? "bg-amber-500" : "bg-green-500")
                      : "bg-slate-200"
                  }`}
                />
              ))}
              <span className={`text-xs font-bold ml-1 ${PRIORITY_STYLES[job.priority]}`}>
                {job.priority}
              </span>
            </div>
          </div>
          {job.estimatedHours && (
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{job.estimatedHours}h est.</span>
          )}
        </div>

        {job.description && (
          <p className="text-slate-600 text-xs font-medium leading-relaxed mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-amber-600 py-2 hover:bg-amber-50 transition-all duration-200 border border-slate-200 hover:border-amber-200 rounded-lg shadow-sm"
          >
            ◈ Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-600 py-2 hover:bg-red-50 transition-all duration-200 border border-slate-200 hover:border-red-200 rounded-lg shadow-sm"
          >
            {deleting ? "..." : "⊘ Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
