import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import api from "../api/axios";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const validationToken = token;
    api
      .get("/auth/me")
      .then((res) => {
        if (localStorage.getItem("token") !== validationToken) return;
        setUser(res.data.user);
      })
      .catch(() => {
        if (localStorage.getItem("token") !== validationToken) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { skipAuthRedirect: true }
    );
    const { token, user: nextUser } = res.data || {};
    if (!token || !nextUser) {
      throw new Error("Invalid login response from server.");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    flushSync(() => {
      setUser(nextUser);
    });
    return nextUser;
  };

  const register = async (name, email, password) => {
    const res = await api.post(
      "/auth/register",
      { name, email, password },
      { skipAuthRedirect: true }
    );
    const { token, user: nextUser } = res.data || {};
    if (!token || !nextUser) {
      throw new Error("Invalid register response from server.");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    flushSync(() => {
      setUser(nextUser);
    });
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
