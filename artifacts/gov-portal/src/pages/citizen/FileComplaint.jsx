import { useState } from "react";
import Layout from "@/components/Layout";
import { departments } from "@/lib/data";
import { Mic, Image, Send, CheckCircle, ChevronDown } from "lucide-react";

export default function FileComplaint() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    department: "",
    priority: "medium",
    description: "",
    location: "",
    phone: "",
    anonymous: false,
  });
  const [recording, setRecording] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout role="citizen" userName="Rajesh Kumar">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted!</h2>
          <p className="text-muted-foreground mb-2">Your complaint has been registered successfully.</p>
          <p className="font-mono font-bold text-primary text-lg mb-6">CMP-{Math.floor(Math.random() * 900) + 100}</p>
          <p className="text-sm text-muted-foreground mb-8">You will receive SMS updates on your registered mobile number.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              File Another
            </button>
            <a href="/citizen/track" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
              Track Status
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">File a Complaint</h2>
          <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Complaint Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Brief description of the issue"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  data-testid="input-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Department *</label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    data-testid="select-department"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.icon} {d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {["low", "medium", "high", "urgent"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                        form.priority === p
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-input text-foreground hover:border-primary"
                      }`}
                      data-testid={`priority-${p}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Complaint Details</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                <div className="relative">
                  <textarea
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Describe the issue in detail..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    data-testid="textarea-description"
                  />
                  <button
                    type="button"
                    onClick={() => setRecording(!recording)}
                    className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-colors ${recording ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                    data-testid="button-voice"
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                {recording && <p className="text-xs text-red-500 mt-1">Recording... Click mic to stop</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Location *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Street address or area"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  data-testid="input-location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Attach Evidence (Photo)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Contact & Confirmation</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mobile Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="+91 XXXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  data-testid="input-phone"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.anonymous}
                  onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
                  data-testid="checkbox-anonymous"
                />
                Submit anonymously
              </label>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p><span className="font-medium">Title:</span> {form.title || "—"}</p>
                <p><span className="font-medium">Department:</span> {form.department || "—"}</p>
                <p><span className="font-medium">Priority:</span> <span className="capitalize">{form.priority}</span></p>
                <p><span className="font-medium">Location:</span> {form.location || "—"}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-2.5 border border-input rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-testid="button-submit"
            >
              {step < 3 ? "Next" : (<><Send className="h-4 w-4" /> Submit Complaint</>)}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
