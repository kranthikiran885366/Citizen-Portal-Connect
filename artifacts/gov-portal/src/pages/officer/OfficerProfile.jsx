import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, Shield, Badge, Save } from "lucide-react";

export default function OfficerProfile() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "Suresh Singh",
    email: "suresh.singh@gov.in",
    phone: "+91 9876543211",
    badge: "OFF-0042",
    department: "Infrastructure",
    designation: "Junior Engineer",
    joined: "2021-08-15",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout role="officer" userName="Suresh Singh">
      <div className="max-w-2xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Officer Profile</h2>
          <p className="text-sm text-muted-foreground">Your government service account</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
            <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">S</div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.designation} • {profile.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-mono">{profile.badge}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} data-testid="input-name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email (Gov)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} data-testid="input-email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="tel" className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} data-testid="input-phone" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                <input type="text" className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-muted" value={profile.department} readOnly />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
              <div><p className="text-muted-foreground">Badge Number</p><p className="font-mono font-medium">{profile.badge}</p></div>
              <div><p className="text-muted-foreground">Designation</p><p className="font-medium">{profile.designation}</p></div>
              <div><p className="text-muted-foreground">Joined</p><p className="font-medium">{profile.joined}</p></div>
              <div><p className="text-muted-foreground">Status</p><p className="text-green-600 font-medium">Active</p></div>
            </div>

            {saved && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Profile updated!</div>}
            <button type="submit" className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-500 transition-colors" data-testid="button-save">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
