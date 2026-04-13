import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import toast from "react-hot-toast";

const StatCard = ({ label, value, sub, accent, delay }) => (
  <div
    className={`card border-l-4 ${accent} animate-fade-in-up`}
    style={{ animationDelay: delay, opacity: 0 }}
  >
    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2">{label}</p>
    <p className="font-display font-800 text-4xl text-slate-800">{value}</p>
    {sub && <p className="text-slate-400 text-xs font-body mt-1 font-medium">{sub}</p>}
  </div>
);

const STATUS_CONFIG = {
  "Pending":     { color: "bg-yellow-500", text: "text-yellow-400" },
  "In Progress": { color: "bg-blue-500",   text: "text-blue-400" },
  "Completed":   { color: "bg-green-500",  text: "text-green-400" },
  "Cancelled":   { color: "bg-red-500",    text: "text-red-400" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, jobsRes] = await Promise.all([
          api.get("/jobs/analytics"),
          api.get("/jobs?limit=5&sort=-createdAt"),
        ]);
        setAnalytics(analyticsRes.data.data);
        setRecentJobs(jobsRes.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusMap = {};
  analytics?.byStatus?.forEach(({ _id, count }) => { statusMap[_id] = count; });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Overview</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-wide text-slate-900">
          Good to see you, <span className="text-amber-600">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={analytics?.totalJobs ?? 0} sub="All time" accent="border-amber-500" delay="0.05s" />
        <StatCard label="Total Workers" value={analytics?.totalWorkers ?? 0} sub="Across all jobs" accent="border-blue-500" delay="0.1s" />
        <StatCard label="In Progress" value={statusMap["In Progress"] ?? 0} sub="Active now" accent="border-green-500" delay="0.15s" />
        <StatCard label="Completed" value={statusMap["Completed"] ?? 0} sub="Finished" accent="border-zinc-500" delay="0.2s" />
      </div>

      {/* Status breakdown + Recent jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="card animate-fade-in-up stagger-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-5">Status Breakdown</h2>
          <div className="space-y-3">
            {["Pending", "In Progress", "Completed", "Cancelled"].map((s) => {
              const count = statusMap[s] ?? 0;
              const pct = analytics?.totalJobs ? Math.round((count / analytics.totalJobs) * 100) : 0;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text.replace("400", "600").replace("500", "600")}`}>{s}</span>
                    <span className="text-slate-400 text-[10px] font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cfg.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top work types */}
        <div className="card animate-fade-in-up stagger-4">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-5">Top Work Types</h2>
          <div className="space-y-3">
            {analytics?.byWorkType?.slice(0, 5).map(({ _id, count }, i) => (
              <div key={_id} className="flex items-center gap-3">
                <span className="text-slate-400 font-bold text-xs w-4">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 text-xs font-bold">{_id}</span>
                    <span className="text-slate-400 text-[10px] font-bold">{count}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-700"
                      style={{ width: `${analytics?.totalJobs ? (count / analytics.totalJobs) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {(!analytics?.byWorkType?.length) && (
              <p className="text-slate-400 text-xs font-medium">No data yet.</p>
            )}
          </div>
        </div>

        {/* Recent jobs */}
        <div className="card animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800">Recent Jobs</h2>
            <Link to="/jobs" className="text-amber-600 text-[10px] font-bold uppercase tracking-widest hover:text-amber-700">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${STATUS_CONFIG[job.status]?.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-bold truncate">{job.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">{job.workType} · {job.location}</p>
                </div>
              </div>
            ))}
            {!recentJobs.length && (
              <p className="text-slate-400 text-xs font-medium">No jobs yet. <Link to="/jobs" className="text-amber-600 font-bold">Add one →</Link></p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up stagger-4">
        <Link to="/jobs" className="card hover:border-amber-200 transition-all duration-200 group flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-center text-amber-500 text-lg shadow-sm group-hover:bg-amber-100 transition-all">
            ◈
          </div>
          <div>
            <p className="font-display font-700 uppercase tracking-wide text-slate-800">Manage Jobs</p>
            <p className="text-slate-500 text-xs font-medium">Add, edit, and track all jobs</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-amber-500 transition-colors">→</span>
        </Link>
        <Link to="/analytics" className="card hover:border-amber-200 transition-all duration-200 group flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-center text-amber-500 text-lg shadow-sm group-hover:bg-amber-100 transition-all">
            ◉
          </div>
          <div>
            <p className="font-display font-700 uppercase tracking-wide text-slate-800">View Analytics</p>
            <p className="text-slate-500 text-xs font-medium">Charts, trends, and insights</p>
          </div>
          <span className="ml-auto text-slate-300 group-hover:text-amber-500 transition-colors">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
