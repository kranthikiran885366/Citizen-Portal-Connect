import { useState } from "react";
import Layout from "@/components/Layout";
import { Save, Settings, Bell, Shield, Database, Globe } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    portalName: "GovCare Citizen Portal",
    orgName: "Ministry of Urban Development",
    timezone: "Asia/Kolkata",
    language: "English",
    smsEnabled: true,
    emailEnabled: true,
    autoEscalate: true,
    escalateHours: 48,
    maintenanceMode: false,
    maxFileSize: 10,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout role="admin" userName="Admin">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">System Settings</h2>
          <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">General Settings</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Portal Name</label>
              <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.portalName} onChange={(e) => setSettings({ ...settings, portalName: e.target.value })} data-testid="input-portal-name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Organization Name</label>
              <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.orgName} onChange={(e) => setSettings({ ...settings, orgName: e.target.value })} data-testid="input-org-name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                <select className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} data-testid="select-timezone">
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>Asia/Dubai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Language</label>
                <select className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} data-testid="select-language">
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Notifications</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { key: "smsEnabled", label: "SMS Notifications", desc: "Send status updates via SMS" },
              { key: "emailEnabled", label: "Email Notifications", desc: "Send updates via email" },
              { key: "autoEscalate", label: "Auto-Escalation", desc: "Automatically escalate overdue complaints" },
            ].map(({ key, label, desc }) => (
              <label key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <input type="checkbox" className="rounded" checked={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })} data-testid={`toggle-${key}`} />
              </label>
            ))}
            {settings.autoEscalate && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Escalation Threshold (hours)</label>
                <input type="number" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.escalateHours} onChange={(e) => setSettings({ ...settings, escalateHours: +e.target.value })} data-testid="input-escalate-hours" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">File & Media Settings</h3>
          </div>
          <div className="p-4">
            <label className="block text-sm font-medium text-foreground mb-1">Max File Size (MB)</label>
            <input type="number" min="1" max="50" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={settings.maxFileSize} onChange={(e) => setSettings({ ...settings, maxFileSize: +e.target.value })} data-testid="input-max-file-size" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Maintenance</h3>
          </div>
          <div className="p-4">
            <label className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg cursor-pointer">
              <div>
                <p className="text-sm font-medium text-red-800">Maintenance Mode</p>
                <p className="text-xs text-red-600">Portal will be inaccessible to citizens</p>
              </div>
              <input type="checkbox" className="rounded" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} data-testid="toggle-maintenance" />
            </label>
          </div>
        </div>

        {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium text-center">Settings saved successfully!</div>}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          data-testid="button-save-settings"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </Layout>
  );
}
