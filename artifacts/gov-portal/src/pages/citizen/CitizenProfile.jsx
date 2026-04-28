import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useApiMutation } from "@/hooks/useApi";
import { User, Mail, Phone, MapPin, Save, Bell, Shield, Edit3, Camera, CheckCircle, LoaderCircle, Eye, EyeOff } from "lucide-react";

export default function CitizenProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", aadhaar: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, email: true, app: true, weekly: false });
  const { mutate, loading } = useApiMutation();

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "", aadhaar: user.aadhaar || "" });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) { alert("Name must be at least 2 characters"); return; }
    await mutate(
      () => authApi.updateProfile(form),
      async () => { await refreshUser(); setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 3000); },
      (err) => alert(err)
    );
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.new_password.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(pwForm.new_password)) { setPwError("Password must contain at least one uppercase letter and one number"); return; }
    if (pwForm.new_password !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    await mutate(
      () => authApi.changePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password }),
      () => { setPwSuccess(true); setPwForm({ current_password: "", new_password: "", confirm: "" }); setTimeout(() => setPwSuccess(false), 3000); },
      (err) => setPwError(err)
    );
  };

  const inp = "w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:bg-slate-50 disabled:text-slate-500";
  const inpDisabled = "w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-700 cursor-not-allowed";

  return (
    <Layout role="citizen">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">👤 My Profile</h2>
            <p className="text-lg text-slate-600 mt-2">Manage your personal information and account settings.</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold shadow-sm">
              <CheckCircle className="h-4 w-4" /> Saved!
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-2xl flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-200 rounded-lg shadow-md hover:bg-slate-50 transition-colors">
                <Camera className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-950">{user?.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified Citizen
                    </span>
                    {user?.aadhaar && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                        <Shield className="h-3.5 w-3.5" /> Aadhaar Linked
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Your basic details registered with GovCare.</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", icon: User, type: "text" },
              { label: "Mobile Number", key: "phone", icon: Phone, type: "tel" },
            ].map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <Icon className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className={editing ? inp : inpDisabled}
                    value={form[field.key]}
                    disabled={!editing}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              );
            })}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Mail className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                Email Address
              </label>
              <input type="email" className={inpDisabled} value={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Aadhaar Number</label>
              <input
                type="text"
                className={editing ? inp : inpDisabled}
                value={form.aadhaar}
                disabled={!editing}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <MapPin className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                Residential Address
              </label>
              <textarea
                className={editing ? `${inp} resize-none` : `${inpDisabled} resize-none`}
                rows={2}
                value={form.address}
                disabled={!editing}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
          {editing && (
            <div className="px-5 pb-5">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "hsl(213, 82%, 44%)" }}
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold text-foreground">Notification Preferences</h3>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[
              { key: "sms", label: "SMS Notifications", desc: "Get updates via SMS on your mobile number" },
              { key: "email", label: "Email Notifications", desc: "Receive complaint updates via email" },
              { key: "app", label: "In-App Notifications", desc: "Show notifications inside the portal" },
              { key: "weekly", label: "Weekly Summary", desc: "Get a weekly summary of all your complaints" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[n.key] ? "bg-primary" : "bg-gray-200"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifications[n.key] ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Change Password
          </h3>
          {pwSuccess && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
              <CheckCircle className="h-4 w-4" /> Password changed successfully!
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: "current_password", label: "Current Password", show: showPw.current, toggle: () => setShowPw(s => ({ ...s, current: !s.current })) },
              { key: "new_password", label: "New Password (min 8 chars, 1 uppercase, 1 number)", show: showPw.new, toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
              { key: "confirm", label: "Confirm New Password", show: showPw.new, toggle: () => setShowPw(s => ({ ...s, new: !s.new })) },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.show ? "text" : "password"}
                    className={`${inp} pr-11`}
                    value={pwForm[field.key]}
                    onChange={(e) => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                    required
                    minLength={field.key !== "current_password" ? 8 : 1}
                  />
                  <button type="button" onClick={field.toggle} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800">
                    {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pwError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pwError}</div>}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "hsl(213, 82%, 44%)" }}
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
