import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/lib/api";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { Save, Bell, Shield, Globe, Clock, AlertTriangle, CheckCircle, LoaderCircle } from "lucide-react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    max_complaints_per_day: "10",
    sla_alert_hours: "24",
    auto_close_days: "30",
    allow_anonymous: "true",
    maintenance_mode: "false",
  });
  const { mutate, loading } = useApiMutation();

  const { data } = useApi(() => authApi.getSettings(), []);

  useEffect(() => {
    if (data) {
      const map = {};
      (Array.isArray(data) ? data : data.settings || []).forEach((s) => { map[s.key] = s.value; });
      setSettings((prev) => ({ ...prev, ...map }));
    }
  }, [data]);

  const handleSave = async () => {
    await mutate(
      async () => {
        for (const [key, value] of Object.entries(settings)) {
          await authApi.saveSetting(key, value);
        }
      },
      () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
      (err) => alert(err)
    );
  };

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: s[key] === "true" ? "false" : "true" }));
  const inp = "w-full px-3.5 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-border bg-muted/20">
        <div className="p-2 bg-blue-50 rounded-xl"><Icon className="h-4 w-4 text-blue-600" /></div>
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
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${settings[keyName] === "true" ? "bg-primary" : "bg-gray-200"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings[keyName] === "true" ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );

  return (
    <Layout role="admin">
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
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "hsl(213, 82%, 44%)" }}
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save All
            </button>
          </div>
        </div>

        <Section title="Complaint Settings" icon={Globe}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Max Complaints Per Day (per citizen)</label>
              <input type="number" className={inp} min={1} max={100} value={settings.max_complaints_per_day} onChange={(e) => setSettings(s => ({ ...s, max_complaints_per_day: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Auto-Close After Resolution (days)</label>
              <input type="number" className={inp} min={1} max={365} value={settings.auto_close_days} onChange={(e) => setSettings(s => ({ ...s, auto_close_days: e.target.value }))} />
            </div>
          </div>
        </Section>

        <Section title="SLA Configuration" icon={Clock}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">SLA Alert Before Deadline (hours)</label>
              <input type="number" className={inp} min={1} max={168} value={settings.sla_alert_hours} onChange={(e) => setSettings(s => ({ ...s, sla_alert_hours: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-1">Send alert this many hours before SLA deadline</p>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-4 gap-3">
            {[
              { priority: "Urgent", sla: "24 hours", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
              { priority: "High", sla: "3 days", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
              { priority: "Medium", sla: "7 days", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { priority: "Low", sla: "14 days", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
            ].map((p) => (
              <div key={p.priority} className={`rounded-xl p-3 border ${p.bg} ${p.border} text-center`}>
                <p className={`text-xs font-bold ${p.color}`}>{p.priority}</p>
                <p className="text-sm font-bold text-foreground mt-1">{p.sla}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Portal Features" icon={Bell}>
          <div className="space-y-1">
            <Toggle label="Allow Anonymous Complaints" desc="Citizens can file complaints without revealing their identity" keyName="allow_anonymous" />
          </div>
        </Section>

        <Section title="System & Security" icon={Shield}>
          <div className="space-y-1 mb-4">
            <Toggle label="Maintenance Mode" desc="Temporarily disable public access to the portal" keyName="maintenance_mode" />
          </div>
          {settings.maintenance_mode === "true" && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-medium">Maintenance mode is ON. The portal is currently inaccessible to citizens and officers.</p>
            </div>
          )}
        </Section>
      </div>
    </Layout>
  );
}
