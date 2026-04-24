import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { departments } from "@/lib/data";
import { Mic, ImageIcon, Send, CheckCircle, ChevronDown, MapPin, Phone, User } from "lucide-react";

const steps = ["Basic Info", "Details", "Confirm"];

export default function FileComplaint() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId] = useState(`CMP-${Math.floor(Math.random() * 900) + 100}`);
  const [form, setForm] = useState({ title: "", department: "", priority: "medium", description: "", location: "", phone: "", anonymous: false });
  const [recording, setRecording] = useState(false);

  const priorities = [
    { val: "low", label: "Low", color: "border-gray-200 text-gray-600 bg-gray-50", active: "border-gray-400 text-gray-800 bg-gray-100" },
    { val: "medium", label: "Medium", color: "border-blue-200 text-blue-600 bg-blue-50", active: "border-blue-500 text-blue-800 bg-blue-100" },
    { val: "high", label: "High", color: "border-orange-200 text-orange-600 bg-orange-50", active: "border-orange-500 text-orange-800 bg-orange-100" },
    { val: "urgent", label: "Urgent", color: "border-red-200 text-red-600 bg-red-50", active: "border-red-500 text-red-800 bg-red-100" },
  ];

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout role="citizen" userName="Rajesh Kumar">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-emerald-50 border-4 border-emerald-200">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted!</h2>
          <p className="text-muted-foreground mb-4">Your complaint has been registered and assigned for review.</p>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 mb-8">
            <span className="text-sm text-blue-600 font-medium">Complaint ID:</span>
            <span className="font-mono font-bold text-blue-800 text-lg">{complaintId}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8 bg-muted/50 rounded-xl p-4">
            📱 You will receive SMS updates on your registered mobile number at each stage of resolution.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setStep(1); setForm({ title: "", department: "", priority: "medium", description: "", location: "", phone: "", anonymous: false }); }}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              File Another
            </button>
            <Link href="/citizen/track" className="px-6 py-2.5 bg-muted text-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">
              Track Status
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="citizen" userName="Rajesh Kumar">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">File a Complaint</h2>
          <p className="text-muted-foreground mt-1">Fill in the details to register your civic complaint with the appropriate department.</p>
        </div>

        <div className="flex items-center gap-0">
          {steps.map((label, i) => {
            const s = i + 1;
            const done = s < step;
            const active = s === step;
            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all ${done ? "bg-emerald-400" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          {step === 1 && (
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Complaint Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="e.g. Broken streetlight on MG Road"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Department <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        required
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary appearance-none"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                      >
                        <option value="">Select the relevant department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>{d.icon} {d.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Priority Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {priorities.map((p) => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setForm({ ...form, priority: p.val })}
                          className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all capitalize ${form.priority === p.val ? p.active : p.color}`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Choose the urgency level that best describes your situation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-4">Complaint Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Detailed Description <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <textarea
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                        placeholder="Describe the issue in detail. Include when it started, frequency, and any impact it has on daily life..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setRecording(!recording)}
                        className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${recording ? "bg-red-500 text-white animate-pulse" : "bg-muted text-muted-foreground hover:text-primary hover:bg-blue-50"}`}
                        title="Voice input"
                      >
                        <Mic className="h-4 w-4" />
                      </button>
                    </div>
                    {recording && <p className="text-xs text-red-500 mt-1 font-medium">🔴 Recording... Tap mic icon to stop</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      <MapPin className="h-3.5 w-3.5 inline mr-1" />
                      Location / Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="Street address, landmark, or area name"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      <ImageIcon className="h-3.5 w-3.5 inline mr-1" />
                      Attach Evidence (Optional)
                    </label>
                    <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-all bg-muted/20 hover:bg-blue-50/30">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop photos</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 10MB — max 5 files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-card border border-border rounded-2xl divide-y divide-border">
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg mb-4">Review & Submit</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      <Phone className="h-3.5 w-3.5 inline mr-1" />
                      Mobile Number (for updates)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={form.anonymous}
                      onChange={(e) => setForm({ ...form, anonymous: e.target.checked })}
                    />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Submit Anonymously</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Your identity will not be shared with the department officer</p>
                    </div>
                  </label>

                  <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                    <h4 className="text-sm font-bold text-foreground">Complaint Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Title</p>
                        <p className="font-semibold text-foreground mt-0.5">{form.title || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Department</p>
                        <p className="font-semibold text-foreground mt-0.5">{form.department || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Priority</p>
                        <p className="font-semibold text-foreground mt-0.5 capitalize">{form.priority}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Location</p>
                        <p className="font-semibold text-foreground mt-0.5">{form.location || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700 font-medium">
                      ⚠️ By submitting, you confirm this complaint is genuine and the information provided is accurate. False complaints may result in account suspension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: "hsl(213, 82%, 44%)" }}
            >
              {step < 3 ? <>Continue <ChevronDown className="h-4 w-4 -rotate-90" /></> : <><Send className="h-4 w-4" /> Submit Complaint</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
