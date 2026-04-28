import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { getAuthSession, saveAuthSession, clearAuthSession, getDashboardPath, authApi } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const session = getAuthSession();
    if (session?.accessToken && session?.user) {
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    const res = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: u } = res.data;
    saveAuthSession({ accessToken, refreshToken, user: u, rememberMe });
    setUser(u);
    setLocation(getDashboardPath(u.role));
    return u;
  }, [setLocation]);

  const logout = useCallback(async () => {
    const session = getAuthSession();
    try { if (session?.refreshToken) await authApi.logout(session.refreshToken); } catch {}
    clearAuthSession();
    setUser(null);
    setLocation("/login");
  }, [setLocation]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      const updated = res.data;
      setUser(updated);
      const session = getAuthSession();
      if (session) saveAuthSession({ ...session, user: updated });
      return updated;
    } catch { return null; }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) { setLocation("/login"); return; }
      if (roles && !roles.includes(user.role)) { setLocation(getDashboardPath(user.role)); }
    }
  }, [user, loading, roles, setLocation]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );

  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return children;
}
