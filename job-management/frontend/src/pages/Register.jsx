import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome to JobOps.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6 relative overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888081647-75b2de1312f1?auto=format&fit=crop&q=80')" }}
    >
      {/* Overlay to ensure readability and neatness */}
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[2px]" />

      <div className="w-full max-w-md bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-8 animate-fade-in-up relative z-10">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md flex items-center justify-center">
            <span className="font-display font-800 text-white text-sm">JO</span>
          </div>
          <span className="font-display font-700 text-xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">JobOps</span>
        </div>

        <div className="mb-8">
          <p className="text-slate-500 font-mono font-bold text-xs uppercase tracking-widest mb-2">Get started</p>
          <h2 className="font-display font-800 text-4xl uppercase tracking-wide text-slate-900">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="input-field" required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
              className="input-field" required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Password</label>
              <input
                type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 chars"
                className="input-field" required
              />
            </div>
            <div>
              <label className="label">Confirm</label>
              <input
                type="password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Re-enter"
                className="input-field" required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : "Create Account →"}
          </button>
        </form>

        <p className="text-slate-500 text-sm font-body text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:text-amber-500 font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
