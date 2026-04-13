import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">

      {/* Left panel with Image */}
      <div 
        className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')" }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center">
              <span className="font-display font-800 text-white">JO</span>
            </div>
            <span className="font-display font-700 text-2xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">JobOps</span>
          </div>
        </div>
        <div className="space-y-6 relative z-10">
          <div className="w-16 h-1 bg-amber-500 rounded-full" />
          <h1 className="font-display font-800 text-6xl uppercase tracking-tight text-slate-900 leading-none drop-shadow-sm">
            Manage<br />
            <span className="text-amber-600">Jobs.</span><br />
            Track<br />
            <span className="text-amber-600">Teams.</span>
          </h1>
          <p className="text-slate-600 font-body text-sm font-medium leading-relaxed max-w-sm">
            Industrial-grade job management for construction, maintenance, and field operations teams.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 relative z-10">
          {["Real-time tracking", "Analytics dashboard", "Team management"].map((f) => (
            <div key={f} className="bg-white/80 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm transition-transform hover:-translate-y-1 duration-300">
              <div className="w-2 h-2 rounded-full bg-amber-500 mb-3 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <p className="text-slate-700 font-bold text-xs font-mono uppercase tracking-wider">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md flex items-center justify-center">
              <span className="font-display font-800 text-white text-sm">JO</span>
            </div>
            <span className="font-display font-700 text-xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">JobOps</span>
          </div>

          <div className="mb-8">
            <p className="text-slate-500 font-mono font-bold text-xs uppercase tracking-widest mb-2">Welcome back</p>
            <h2 className="font-display font-800 text-4xl uppercase tracking-wide text-slate-900">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="input-field" required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field" required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : "Sign In →"}
            </button>
          </form>

          <p className="text-slate-500 text-sm font-body text-center mt-6">
            No account?{" "}
            <Link to="/register" className="text-amber-600 hover:text-amber-500 font-bold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
