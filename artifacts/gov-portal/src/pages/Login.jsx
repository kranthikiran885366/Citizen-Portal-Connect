import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, LoaderCircle, MessageSquareText, ShieldCheck, UserCircle2, Sparkles } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/lib/AuthContext";
import { getDashboardPath } from "@/lib/api";

const demoAccounts = {
  citizen: { email: "rajesh.kumar@example.com", password: "Citizen@123", label: "Citizen demo" },
  officer: { email: "suresh.singh@govcare.gov.in", password: "Officer@123", label: "Officer demo" },
  admin: { email: "admin@govcare.gov.in", password: "Admin@123", label: "Admin demo" },
};

export default function Login() {
  const { login, user } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setLocation(getDashboardPath(user.role));
  }, [user, setLocation]);

  const fillDemo = (role) => {
    const d = demoAccounts[role];
    setEmail(d.email);
    setPassword(d.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    if (!password) { setError("Password is required"); return; }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to continue"
      subtitle="Access your dashboard to manage complaints, monitor updates, and keep track of civic requests."
      sideTitle="A Transparent Future"
      sideText="Securely file and track your grievances. Every citizen's voice matters in our governance ecosystem."
    >
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <p className="font-semibold text-slate-900">🎯 Demo Accounts Available</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(demoAccounts).map(([key, demo]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => fillDemo(key)}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-blue-400 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-50 hover:border-blue-500"
                >
                  <UserCircle2 className="h-3.5 w-3.5" />
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Email Address</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Password</span>
            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">Forgot?</a>
          </div>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="flex items-center gap-2.5 text-sm text-slate-600">
          <input
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
          />
          <span className="font-medium">Keep me signed in for 30 days</span>
        </label>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <span>⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "🔐"}
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-600">
          New here?{" "}
          <Link href="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
