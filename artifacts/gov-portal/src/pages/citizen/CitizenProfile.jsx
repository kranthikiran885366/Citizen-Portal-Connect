import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, MapPin, Save, Bell, Shield, Edit3, Camera, CheckCircle } from "lucide-react";

export default function CitizenProfile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    address: "23, MG Road, Sector 5, New Delhi - 110001",
    aadhaar: "XXXX-XXXX-4521",
    dob: "1985-06-15",
    language: "Hindi",
  });
  const [notifications, setNotifications] = useState({ sms: true, email: true, app: true, weekly: false });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const inpDisabled = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-muted text-foreground transition-all";

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
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
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold" style={{ background: "hsl(213, 82%, 44%)" }}>
                R
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-border rounded-lg shadow-sm hover:bg-muted transition-colors">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{form.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{form.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> Verified Citizen
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                      <Shield className="h-3 w-3" /> Aadhaar Linked
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
            <h3 className="font-bold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Your basic details registered with GovCare.</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", icon: User, type: "text" },
              { label: "Email Address", key: "email", icon: Mail, type: "email" },
              { label: "Mobile Number", key: "phone", icon: Phone, type: "tel" },
              { label: "Date of Birth", key: "dob", icon: User, type: "date" },
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
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: "hsl(213, 82%, 44%)" }}>
                <Save className="h-4 w-4" /> Save Changes
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
            Security
          </h3>
          <div className="space-y-3">
            {[
              { label: "Aadhaar Number", val: form.aadhaar, secure: true },
              { label: "Account Status", val: "Active & Verified", secure: false },
              { label: "Registered Since", val: "March 2023", secure: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{item.val}</p>
                </div>
                {item.secure && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Secure</span>}
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </Layout>
  );
}
