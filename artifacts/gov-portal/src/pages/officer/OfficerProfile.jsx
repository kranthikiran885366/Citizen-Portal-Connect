import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, Shield, Save, Edit3, Camera, CheckCircle, Building2, Star, Award } from "lucide-react";

export default function OfficerProfile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Suresh Singh",
    badge: "OFF-2021-INF-007",
    department: "Infrastructure",
    email: "suresh.singh@govcare.gov.in",
    phone: "+91 94567 12345",
    designation: "Senior Field Officer",
    joined: "March 2021",
    zone: "Central Delhi",
  });

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 3000); };
  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10";
  const inpOff = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-muted text-foreground";

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Officer Profile</h2>
            <p className="text-muted-foreground mt-1">Your official profile and departmental information.</p>
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
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold bg-emerald-600">S</div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-border rounded-lg shadow-sm hover:bg-muted transition-colors">
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{form.name}</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">{form.designation} · {form.department}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> Active Duty
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                      <Shield className="h-3 w-3" /> {form.badge}
                    </span>
                  </div>
                </div>
                <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  <Edit3 className="h-4 w-4" /> {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cases Assigned", val: "12", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Resolved", val: "10", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Citizen Rating", val: "4.5★", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "SLA Compliance", val: "92%", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Official Information</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", icon: User, type: "text" },
              { label: "Badge Number", key: "badge", icon: Shield, type: "text", locked: true },
              { label: "Department", key: "department", icon: Building2, type: "text", locked: true },
              { label: "Designation", key: "designation", icon: Award, type: "text" },
              { label: "Email Address", key: "email", icon: Mail, type: "email" },
              { label: "Mobile Number", key: "phone", icon: Phone, type: "tel" },
            ].map((field) => {
              const Icon = field.icon;
              const isLocked = field.locked;
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    <Icon className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
                    {field.label}
                    {isLocked && <span className="text-xs text-muted-foreground ml-1">(admin-locked)</span>}
                  </label>
                  <input
                    type={field.type}
                    className={editing && !isLocked ? inp : inpOff}
                    value={form[field.key]}
                    disabled={!editing || isLocked}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                </div>
              );
            })}
          </div>
          {editing && (
            <div className="px-5 pb-5">
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity" style={{ background: "hsl(213, 82%, 44%)" }}>
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
