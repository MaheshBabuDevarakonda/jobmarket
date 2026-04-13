import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import toast from "react-hot-toast";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard", icon: "⬡" },
  { path: "/jobs", label: "Jobs", icon: "◈" },
  { path: "/analytics", label: "Analytics", icon: "◉" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-sm flex items-center justify-center">
              <span className="font-display font-800 text-white text-sm">JO</span>
            </div>
            <span className="font-display font-700 text-xl tracking-widest uppercase text-slate-800 hover:text-amber-600 transition-colors">
              JobOps
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-200 rounded-full ${
                  location.pathname === link.path
                    ? "text-amber-700 bg-amber-50 shadow-sm border border-amber-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User + Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-slate-800 text-sm font-body font-bold leading-none">{user?.name}</p>
              <p className="text-slate-500 text-xs font-mono mt-0.5 uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-700 font-display font-700 text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 font-mono text-xs uppercase tracking-widest transition-colors px-3 py-2 hover:bg-red-50 rounded-full"
            >
              Exit
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-500 hover:text-slate-900 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 space-y-1">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1 animate-fade-in-up bg-white absolute left-0 right-0 px-4 shadow-lg">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest rounded-xl ${
                  location.pathname === link.path
                    ? "text-amber-700 bg-amber-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-600 text-sm font-bold">{user?.name}</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-mono text-xs uppercase tracking-widest">
                Exit
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
