import { useState } from "react";
import Layout from "@/components/Layout";
import { Save, Bell, Shield, Database, Globe, Mail, Clock, AlertTriangle, CheckCircle, Settings } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    portalName: "GovCare Citizen Portal",
    supportEmail: "support@govcare.gov.in",
    contactPhone: "1800-XXX-XXXX",
    timezone: "Asia/Kolkata",
    language: "English",
    slaUrgent: 24,
    slaHigh: 72,
    slaMedium: 168,
    slaLow: 336,
    emailNotify: true,
    smsNotify: true,
    appNotify: true,
    slaAlerts: true,
    weeklyReport: true,
    autoEscalate: true,
    maintenanceMode: false,
    dataRetention: 365,
    maxFileSize: 10,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-border bg-muted/20">
        <div className="p-2 bg-blue-50 rounded-xl">
          <Icon className="h-4.5 w-4.5 text-blue-600" />
        </div>
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const Toggle = ({ label, desc, keyName }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => toggle(keyName)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${settings[keyName] ? "bg-primary" : "bg-gray-200"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings[keyName] ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );

  return (
    <Layout role="admin" userName="Admin">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
            <p className="text-muted-foreground mt-1">Configure portal settings, SLA policies, and notification preferences.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
                <CheckCircle className="h-4 w-4" /> Saved!
              </div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: "hsl(213, 82%, 44%)" }}
            >
              <Save className="h-4 w-4" /> Save All
            </button>
          </div>
        </div>

        <Section title="General Configuration" icon={Globe}>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Portal Name", key: "portalName", type: "text" },
              { label: "Support Email", key: "supportEmail", type: "email" },
              { label: "Contact Phone", key: "contactPhone", type: "tel" },
              { label: "Timezone", key: "timezone", type: "text" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                <input type={field.type} className={inp} value={settings[field.key]} onChange={(e) => setSettings(s => ({ ...s, [field.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="SLA Policy Configuration" icon={Clock}>
          <p className="text-sm text-muted-foreground mb-4">Set resolution time targets for each complaint priority level.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Urgent Priority (hours)", key: "slaUrgent", color: "text-red-600" },
              { label: "High Priority (hours)", key: "slaHigh", color: "text-orange-600" },
              { label: "Medium Priority (hours)", key: "slaMedium", color: "text-blue-600" },
              { label: "Low Priority (hours)", key: "slaLow", color: "text-slate-600" },
            ].map((field) => (
              <div key={field.key}>
                <label className={`block text-sm font-semibold mb-1.5 ${field.color}`}>{field.label}</label>
                <input
                  type="number"
                  className={inp}
                  value={settings[field.key]}
                  onChange={(e) => setSettings(s => ({ ...s, [field.key]: parseInt(e.target.value) }))}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Notification Settings" icon={Bell}>
          <div className="space-y-1">
            <Toggle label="Email Notifications" desc="Send email updates for complaint status changes" keyName="emailNotify" />
            <Toggle label="SMS Notifications" desc="Send SMS alerts to registered mobile numbers" keyName="smsNotify" />
            <Toggle label="In-App Notifications" desc="Show notifications inside the portal" keyName="appNotify" />
            <Toggle label="SLA Breach Alerts" desc="Notify admins when SLA deadlines are breached" keyName="slaAlerts" />
            <Toggle label="Weekly Summary Reports" desc="Auto-generate and email weekly performance reports" keyName="weeklyReport" />
            <Toggle label="Auto-Escalate Breaches" desc="Automatically escalate SLA breaches to department heads" keyName="autoEscalate" />
          </div>
        </Section>

        <Section title="System & Security" icon={Shield}>
          <div className="space-y-1 mb-4">
            <Toggle label="Maintenance Mode" desc="Temporarily disable public access to the portal" keyName="maintenanceMode" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Data Retention (days)</label>
              <input type="number" className={inp} value={settings.dataRetention} onChange={(e) => setSettings(s => ({ ...s, dataRetention: parseInt(e.target.value) }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Max File Upload Size (MB)</label>
              <input type="number" className={inp} value={settings.maxFileSize} onChange={(e) => setSettings(s => ({ ...s, maxFileSize: parseInt(e.target.value) }))} />
            </div>
          </div>
          {settings.maintenanceMode && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-medium">Maintenance mode is ON. The portal is currently inaccessible to citizens and officers.</p>
            </div>
          )}
        </Section>
      </div>
    </Layout>
  );
}
