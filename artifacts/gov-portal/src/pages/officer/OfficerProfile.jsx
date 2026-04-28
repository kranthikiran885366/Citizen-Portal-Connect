import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useApiMutation } from "@/hooks/useApi";
import { User, Mail, Phone, MapPin, Save, Shield, Edit3, Camera, CheckCircle, LoaderCircle, Eye, EyeOff, Building2 } from "lucide-react";

export default function OfficerProfile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const { mutate, loading } = useApiMutation();

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", address: user.address || "" });
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

  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const inpDisabled = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-muted text-foreground";

  return (
    <Layout role="officer">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            <p className="text-muted-foreground mt-1">Manage your officer profile and account settings.</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
              <CheckCircle className="h-4 w-4" /> Saved!
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold bg-emerald-600">
                {user?.name?.charAt(0)?.toUpperCase() || "O"}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-border rounded-lg shadow-sm hover:bg-muted transition-colors">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{user?.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> Verified Officer
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                      <Shield className="h-3 w-3" /> Active
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Officer Information</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <User className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" /> Full Name
              </label>
              <input type="text" className={editing ? inp : inpDisabled} value={form.name} disabled={!editing} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Phone className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" /> Mobile Number
              </label>
              <input type="tel" className={editing ? inp : inpDisabled} value={form.phone} disabled={!editing} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Mail className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" /> Email Address
              </label>
              <input type="email" className={inpDisabled} value={user?.email || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <Building2 className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" /> Department
              </label>
              <input type="text" className={inpDisabled} value={user?.department_name || "—"} disabled />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                <MapPin className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" /> Address
              </label>
              <textarea className={editing ? `${inp} resize-none` : `${inpDisabled} resize-none`} rows={2} value={form.address} disabled={!editing} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          {editing && (
            <div className="px-5 pb-5">
              <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed bg-emerald-600">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" /> Change Password
          </h3>
          {pwSuccess && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
              <CheckCircle className="h-4 w-4" /> Password changed successfully!
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: "current_password", label: "Current Password", showKey: "current" },
              { key: "new_password", label: "New Password (min 8 chars, 1 uppercase, 1 number)", showKey: "new" },
              { key: "confirm", label: "Confirm New Password", showKey: "new" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={showPw[field.showKey] ? "text" : "password"}
                    className={`${inp} pr-11`}
                    value={pwForm[field.key]}
                    onChange={(e) => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, [field.showKey]: !s[field.showKey] }))} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-800">
                    {showPw[field.showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pwError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{pwError}</div>}
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed bg-emerald-600">
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              Change Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
