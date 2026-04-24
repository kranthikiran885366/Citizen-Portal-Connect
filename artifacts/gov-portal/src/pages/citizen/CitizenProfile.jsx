import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, MapPin, Save, Bell, Shield } from "lucide-react";

export default function CitizenProfile() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543210",
    address: "123, Main Street, Sector 5, Delhi - 110001",
    aadhaar: "XXXX-XXXX-1234",
    smsNotif: true,
    emailNotif: true,
    appNotif: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              R
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">Citizen ID: CIT-00123</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Verified Citizen</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Aadhaar (last 4 digits)</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={profile.aadhaar}
                    readOnly
                    data-testid="input-aadhaar"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <textarea
                  rows={2}
                  className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  data-testid="textarea-address"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-foreground" />
                <h4 className="font-medium text-foreground">Notification Preferences</h4>
              </div>
              <div className="space-y-2">
                {[
                  { key: "smsNotif", label: "SMS Notifications" },
                  { key: "emailNotif", label: "Email Notifications" },
                  { key: "appNotif", label: "Push Notifications" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg cursor-pointer">
                    <span className="text-sm text-foreground">{label}</span>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={profile[key]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.checked })}
                      data-testid={`checkbox-${key}`}
                    />
                  </label>
                ))}
              </div>
            </div>

            {saved && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-save-profile"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
