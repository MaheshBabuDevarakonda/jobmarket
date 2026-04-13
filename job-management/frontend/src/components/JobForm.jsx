import { useState, useEffect } from "react";

const WORK_TYPES = [
  "Construction", "Electrical", "Plumbing", "Carpentry",
  "Painting", "Landscaping", "IT & Tech", "Maintenance", "Cleaning", "Logistics", "Other",
];
const STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const EMPTY_FORM = {
  title: "", workType: "", location: "", date: "",
  workers: "", status: "Pending", priority: "Medium",
  description: "", estimatedHours: "",
};

const JobForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        workType: initialData.workType || "",
        location: initialData.location || "",
        date: initialData.date ? initialData.date.substring(0, 10) : "",
        workers: initialData.workers || "",
        status: initialData.status || "Pending",
        priority: initialData.priority || "Medium",
        description: initialData.description || "",
        estimatedHours: initialData.estimatedHours || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, workers: Number(form.workers), estimatedHours: Number(form.estimatedHours) || undefined });
  };

  const priorityColors = {
    Low: "text-green-400 border-green-800 bg-green-900/20",
    Medium: "text-amber-400 border-amber-800 bg-amber-900/20",
    High: "text-orange-400 border-orange-800 bg-orange-900/20",
    Critical: "text-red-400 border-red-800 bg-red-900/20",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="label">Job Title *</label>
        <input
          name="title" value={form.title} onChange={handleChange}
          placeholder="e.g. Site Renovation Phase 2"
          className="input-field" required
        />
      </div>

      {/* Work Type + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Work Type *</label>
          <select name="workType" value={form.workType} onChange={handleChange} className="input-field" required>
            <option value="">Select type...</option>
            {WORK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Location *</label>
          <input
            name="location" value={form.location} onChange={handleChange}
            placeholder="e.g. Visakhapatnam, AP"
            className="input-field" required
          />
        </div>
      </div>

      {/* Date + Workers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Date *</label>
          <input
            type="date" name="date" value={form.date} onChange={handleChange}
            className="input-field" required
          />
        </div>
        <div>
          <label className="label">Workers *</label>
          <input
            type="number" name="workers" value={form.workers} onChange={handleChange}
            placeholder="No. of workers" min="1"
            className="input-field" required
          />
        </div>
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <div className="grid grid-cols-4 gap-1">
            {PRIORITIES.map((p) => (
              <button
                key={p} type="button"
                onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                className={`py-2 text-xs font-mono uppercase border transition-all ${
                  form.priority === p
                    ? priorityColors[p]
                    : "text-zinc-500 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Est. Hours + Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Est. Hours</label>
          <input
            type="number" name="estimatedHours" value={form.estimatedHours} onChange={handleChange}
            placeholder="e.g. 40" min="0"
            className="input-field"
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange}
            placeholder="Brief job description..."
            rows={1} className="input-field resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 flex-1 justify-center">
          {loading ? (
            <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>{initialData ? "◈ Update Job" : "⊕ Create Job"}</span>
          )}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;
