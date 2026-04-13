import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import toast from "react-hot-toast";

const WORK_TYPES = [
  "All", "Construction", "Electrical", "Plumbing", "Carpentry",
  "Painting", "Landscaping", "IT & Tech", "Maintenance", "Cleaning", "Logistics", "Other",
];
const STATUSES = ["All", "Pending", "In Progress", "Completed", "Cancelled"];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in-up">
    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
        <h2 className="font-display font-700 text-xl uppercase tracking-wide text-zinc-100">{title}</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 text-xl w-8 h-8 flex items-center justify-center hover:bg-zinc-800 transition-all">
          ×
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "All", workType: "All" });
  const [page, setPage] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort: "-createdAt" });
      if (filters.search) params.set("search", filters.search);
      if (filters.status !== "All") params.set("status", filters.status);
      if (filters.workType !== "All") params.set("workType", filters.workType);
      const res = await api.get(`/jobs?${params}`);
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchJobs(), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const handleAdd = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/jobs", data);
      toast.success("Job created!");
      setShowAddModal(false);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    try {
      await api.put(`/jobs/${editJob._id}`, data);
      toast.success("Job updated!");
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Job deleted.");
      fetchJobs();
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-1">Management</p>
          <h1 className="font-display font-800 text-4xl uppercase tracking-wide text-zinc-100">Jobs</h1>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">⊕</span> New Job
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6 animate-fade-in-up stagger-1">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search jobs, locations..."
              className="input-field"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="input-field sm:w-40"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filters.workType}
            onChange={(e) => handleFilterChange("workType", e.target.value)}
            className="input-field sm:w-44"
          >
            {WORK_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Results info */}
      {!loading && (
        <div className="flex items-center justify-between mb-4 animate-fade-in-up stagger-2">
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            {pagination.total ?? 0} job{pagination.total !== 1 ? "s" : ""} found
          </p>
          {(filters.search || filters.status !== "All" || filters.workType !== "All") && (
            <button
              onClick={() => { setFilters({ search: "", status: "All", workType: "All" }); setPage(1); }}
              className="text-amber-400 hover:text-amber-300 text-xs font-mono uppercase tracking-widest"
            >
              Clear filters ×
            </button>
          )}
        </div>
      )}

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-zinc-600 font-display font-700 text-2xl uppercase tracking-wide mb-2">No Jobs Found</p>
          <p className="text-zinc-600 text-sm font-body mb-6">
            {filters.search || filters.status !== "All" || filters.workType !== "All"
              ? "Try adjusting your filters."
              : "Create your first job to get started."}
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            ⊕ Create First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={setEditJob}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 font-mono text-sm transition-all ${
                  p === page
                    ? "bg-amber-500 text-zinc-950 font-700"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="◈ New Job" onClose={() => setShowAddModal(false)}>
          <JobForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} loading={submitting} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editJob && (
        <Modal title="◈ Edit Job" onClose={() => setEditJob(null)}>
          <JobForm onSubmit={handleUpdate} onCancel={() => setEditJob(null)} initialData={editJob} loading={submitting} />
        </Modal>
      )}
    </div>
  );
};

export default Jobs;
