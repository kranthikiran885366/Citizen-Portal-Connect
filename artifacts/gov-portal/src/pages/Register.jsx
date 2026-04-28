import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { authApi, getDashboardPath, saveAuthSession } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { departmentApi } from "@/lib/api";

function validate(form, role) {
  if (!form.name.trim() || form.name.trim().length < 2) return "Full name must be at least 2 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email address";
  if (form.password.length < 8) return "Password must be at least 8 characters";
  if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) return "Password must contain at least one uppercase letter and one number";
  if (form.phone && !/^[+\d\s\-()]{7,15}$/.test(form.phone)) return "Enter a valid phone number";
  if (form.aadhaar && !/^\d{4}[-\s]?\d{4}[-\s]?\d{4}$/.test(form.aadhaar)) return "Enter a valid 12-digit Aadhaar number";
  if (role === "officer" && !form.department_id) return "Please select a department";
  return null;
}

const inputClasses = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500";

export default function Register() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", aadhaar: "", address: "", department_id: "", designation: "Field Officer" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: departments } = useApi(() => departmentApi.list(), []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form, role);
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, role };
      if (role !== "officer") { delete payload.department_id; delete payload.designation; }
      else payload.department_id = Number(payload.department_id);
      const res = await authApi.register(payload);
      saveAuthSession({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, user: res.data.user, rememberMe: true });
      setLocation(getDashboardPath(res.data.user.role));
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Register for Citizen Portal"
      subtitle="Create a secure account to submit complaints, receive updates, and follow every resolution step."
      sideTitle="Join the civic network"
      sideText="Build your profile once and use it across grievance filing, status tracking, and department communication."
    >
      <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1.5 text-sm">
        {["citizen", "officer"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-lg px-4 py-2.5 font-semibold transition-all ${role === r ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            {r === "citizen" ? "👤 Citizen" : "👨‍💼 Officer"}
          </button>
        ))}
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block sm:col-span-2">
          <span className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Full Name *</span>
          <input value={form.name} onChange={update("name")} type="text" className={inputClasses} required minLength={2} placeholder="John Doe" />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Email *</span>
          <input value={form.email} onChange={update("email")} type="email" className={inputClasses} required placeholder="your@email.com" />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Password * <span className="text-[10px] font-normal text-slate-500">(8+ chars, 1 uppercase, 1 number)</span></span>
          <div className="relative">
            <input value={form.password} onChange={update("password")} type={showPassword ? "text" : "password"} className={`${inputClasses} pr-11`} required minLength={8} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-slate-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Phone</span>
          <input value={form.phone} onChange={update("phone")} type="tel" className={inputClasses} placeholder="+91 98765 43210" />
        </label>

        <label className="block">
          <span className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Aadhaar</span>
          <input value={form.aadhaar} onChange={update("aadhaar")} type="text" className={inputClasses} placeholder="1234 5678 9012" maxLength={14} />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Address</span>
          <textarea value={form.address} onChange={update("address")} rows={2} className={inputClasses} placeholder="Your residential address" />
        </label>

        {role === "officer" && (
          <>
            <label className="block">
              <span className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Department *</span>
              <select value={form.department_id} onChange={update("department_id")} className={inputClasses} required>
                <option value="">Select department</option>
                {(departments?.departments || departments || []).map((d) => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Designation</span>
              <input value={form.designation} onChange={update("designation")} type="text" className={inputClasses} placeholder="Senior Officer" />
            </label>
          </>
        )}

        {error && (
          <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "🚀"}
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="sm:col-span-2 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-blue-600 transition hover:text-blue-700">Sign in here</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
