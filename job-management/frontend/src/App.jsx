import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { setRedirectToLogin } from "./api/navigationRef";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Analytics from "./pages/Analytics";

const AppLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen bg-transparent">
      <Outlet />
    </main>
  </>
);

const AuthNavigationBridge = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setRedirectToLogin(() => navigate("/login", { replace: true }));
    return () =>
      setRedirectToLogin(() => {
        window.location.assign(`${window.location.origin}/login`);
      });
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthNavigationBridge />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1e293b",
              border: "1px solid #e2e8f0",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
            success: { iconTheme: { primary: "#d97706", secondary: "#ffffff" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#ffffff" } },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
