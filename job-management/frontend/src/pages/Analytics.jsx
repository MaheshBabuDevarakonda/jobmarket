import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../api/axios";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const CHART_COLORS = [
  "#f59e0b", "#3b82f6", "#10b981", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
  "#f97316", "#6366f1", "#14b8a6",
];

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#64748b", font: { family: "DM Sans", size: 12, weight: "600" }, padding: 16 },
    },
    tooltip: {
      backgroundColor: "#ffffff",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      titleColor: "#0f172a",
      bodyColor: "#475569",
      titleFont: { family: "DM Sans", size: 13, weight: "700" },
      bodyFont: { family: "DM Sans", size: 12 },
      padding: 12,
      boxPadding: 6,
    },
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8", font: { family: "DM Sans", size: 11 } },
      grid: { color: "#f1f5f9" },
    },
    y: {
      ticks: { color: "#94a3b8", font: { family: "DM Sans", size: 11 } },
      grid: { color: "#f1f5f9" },
      beginAtZero: true,
    },
  },
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/analytics")
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  // Work type bar chart
  const workTypeChart = {
    labels: data.byWorkType.map((d) => d._id),
    datasets: [{
      label: "Jobs",
      data: data.byWorkType.map((d) => d.count),
      backgroundColor: CHART_COLORS.map((c) => c + "cc"),
      borderColor: CHART_COLORS,
      borderWidth: 1,
    }],
  };

  // Workers by work type bar chart
  const workersChart = {
    labels: data.byWorkType.map((d) => d._id),
    datasets: [{
      label: "Workers Deployed",
      data: data.byWorkType.map((d) => d.workers),
      backgroundColor: "#f59e0b33",
      borderColor: "#f59e0b",
      borderWidth: 2,
    }],
  };

  // Status doughnut
  const statusChart = {
    labels: data.byStatus.map((d) => d._id),
    datasets: [{
      data: data.byStatus.map((d) => d.count),
      backgroundColor: ["#fbbf2433", "#3b82f633", "#10b98133", "#ef444433"],
      borderColor:     ["#fbbf24",   "#3b82f6",   "#10b981",   "#ef4444"],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  // Priority doughnut
  const priorityOrder = ["Low", "Medium", "High", "Critical"];
  const priorityMap = {};
  data.byPriority.forEach(({ _id, count }) => { priorityMap[_id] = count; });
  const priorityChart = {
    labels: priorityOrder,
    datasets: [{
      data: priorityOrder.map((p) => priorityMap[p] ?? 0),
      backgroundColor: ["#10b98133", "#f59e0b33", "#f9730633", "#ef444433"],
      borderColor:     ["#10b981",   "#f59e0b",   "#f97306",   "#ef4444"],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  // Top locations bar
  const locationChart = {
    labels: data.byLocation.map((d) => d._id),
    datasets: [{
      label: "Jobs",
      data: data.byLocation.map((d) => d.count),
      backgroundColor: "#3b82f633",
      borderColor: "#3b82f6",
      borderWidth: 1.5,
    }],
  };

  // Trend line
  const trendChart = {
    labels: data.jobsTrend.map((d) => d._id),
    datasets: [{
      label: "Jobs Created",
      data: data.jobsTrend.map((d) => d.count),
      borderColor: "#f59e0b",
      backgroundColor: "#f59e0b15",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#f59e0b",
      pointRadius: 4,
    }],
  };

  const noScaleOpts = { ...chartDefaults, scales: undefined };

  const KPI = ({ label, value, color }) => (
    <div className={`card border-l-4 ${color}`}>
      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2">{label}</p>
      <p className="font-display font-800 text-4xl text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-1">Insights</p>
        <h1 className="font-display font-800 text-4xl uppercase tracking-wide text-slate-900">Analytics</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        <KPI label="Total Jobs" value={data.totalJobs} color="border-amber-500" />
        <KPI label="Total Workers" value={data.totalWorkers} color="border-blue-500" />
        <KPI label="Work Types" value={data.byWorkType.length} color="border-green-500" />
        <KPI label="Locations" value={data.byLocation.length} color="border-purple-500" />
      </div>

      {/* Jobs by Work Type + Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-fade-in-up stagger-2">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-1">Jobs by Work Type</h2>
          <p className="text-slate-500 text-xs font-medium mb-4">Distribution across categories</p>
          <div style={{ height: 260 }}>
            {data.byWorkType.length ? (
              <Bar data={workTypeChart} options={{ ...chartDefaults, indexAxis: "y" }} />
            ) : (
              <p className="text-slate-400 text-sm font-medium">No data yet.</p>
            )}
          </div>
        </div>
        <div className="card animate-fade-in-up stagger-2">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-1">Workers by Work Type</h2>
          <p className="text-slate-500 text-xs font-medium mb-4">Total workers deployed per category</p>
          <div style={{ height: 260 }}>
            {data.byWorkType.length ? (
              <Bar data={workersChart} options={{ ...chartDefaults, indexAxis: "y" }} />
            ) : (
              <p className="text-slate-400 text-sm font-medium">No data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Status + Priority Doughnuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card sm:col-span-1 lg:col-span-2 animate-fade-in-up stagger-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-4">Status Distribution</h2>
          <div style={{ height: 220 }}>
            {data.byStatus.length ? (
              <Doughnut data={statusChart} options={{ ...noScaleOpts, cutout: "65%" }} />
            ) : <p className="text-slate-400 text-sm font-medium">No data.</p>}
          </div>
        </div>
        <div className="card sm:col-span-1 lg:col-span-2 animate-fade-in-up stagger-3">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-4">Priority Distribution</h2>
          <div style={{ height: 220 }}>
            {data.byPriority.length ? (
              <Doughnut data={priorityChart} options={{ ...noScaleOpts, cutout: "65%" }} />
            ) : <p className="text-slate-400 text-sm font-medium">No data.</p>}
          </div>
        </div>
      </div>

      {/* Location Bar + Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-fade-in-up stagger-4">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-1">Jobs by Location</h2>
          <p className="text-slate-500 text-xs font-medium mb-4">Top 10 locations</p>
          <div style={{ height: 240 }}>
            {data.byLocation.length ? (
              <Bar data={locationChart} options={chartDefaults} />
            ) : <p className="text-slate-400 text-sm font-medium">No data yet.</p>}
          </div>
        </div>
        <div className="card animate-fade-in-up stagger-4">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-1">Job Creation Trend</h2>
          <p className="text-slate-500 text-xs font-medium mb-4">Last 30 days</p>
          <div style={{ height: 240 }}>
            {data.jobsTrend.length ? (
              <Line data={trendChart} options={chartDefaults} />
            ) : <p className="text-slate-400 text-sm font-medium">No trend data yet.</p>}
          </div>
        </div>
      </div>

      {/* Location table */}
      {data.byLocation.length > 0 && (
        <div className="card animate-fade-in-up stagger-4">
          <h2 className="font-display font-700 text-lg uppercase tracking-wide text-slate-800 mb-4">Location Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-slate-500 text-[10px] uppercase font-bold tracking-widest pb-3 pr-6">#</th>
                  <th className="text-left text-slate-500 text-[10px] uppercase font-bold tracking-widest pb-3 pr-6">Location</th>
                  <th className="text-left text-slate-500 text-[10px] uppercase font-bold tracking-widest pb-3 pr-6">Jobs</th>
                  <th className="text-left text-slate-500 text-[10px] uppercase font-bold tracking-widest pb-3">Share</th>
                </tr>
              </thead>
              <tbody>
                {data.byLocation.map(({ _id, count }, i) => (
                  <tr key={_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-6 text-slate-400 font-bold text-[10px]">{i + 1}</td>
                    <td className="py-3 pr-6 text-slate-800 font-medium">{_id}</td>
                    <td className="py-3 pr-6 text-amber-600 font-bold">{count}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-24">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${data.totalJobs ? (count / data.totalJobs) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-slate-500 font-bold text-[10px]">
                          {data.totalJobs ? Math.round((count / data.totalJobs) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
