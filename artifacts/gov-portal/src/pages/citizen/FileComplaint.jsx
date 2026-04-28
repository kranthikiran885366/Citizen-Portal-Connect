import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { complaintApi, departmentApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import {
  findComplaintInCatalog,
  generateComplaintId,
  getComplaintCatalog,
  normalizeComplaintId,
  submitComplaint,
  validateComplaintForm,
} from "@/lib/complaints";
import {
  findDepartmentCatalogEntry,
  getComplaintDepartments,
  getComplaintFeatureOptions,
  getComplaintTypeOptions,
} from "@/lib/departmentCatalog";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ClipboardList,
  FileUp,
  ImageIcon,
  Loader2,
  MapPin,
  Mic,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

const steps = ["Basic Info", "Details", "Review"];

const priorities = [
  { value: "low", label: "Low", chip: "border-slate-200 bg-slate-50 text-slate-600", active: "border-slate-400 bg-slate-100 text-slate-900" },
  { value: "medium", label: "Medium", chip: "border-sky-200 bg-sky-50 text-sky-600", active: "border-sky-500 bg-sky-100 text-sky-900" },
  { value: "high", label: "High", chip: "border-orange-200 bg-orange-50 text-orange-600", active: "border-orange-500 bg-orange-100 text-orange-900" },
  { value: "urgent", label: "Urgent", chip: "border-red-200 bg-red-50 text-red-600", active: "border-red-500 bg-red-100 text-red-900" },
];

function validateDepartmentStep(form) {
  const errors = {};

  if (!form.title.trim() || form.title.trim().length < 8) {
    errors.title = "Complaint title must be at least 8 characters.";
  }

  if (!form.departmentName) {
    errors.departmentName = "Select a department.";
  }

  if (!form.complaintType) {
    errors.complaintType = "Select the complaint type.";
  }

  return errors;
}

function validateDetailStep(form) {
  const errors = {};

  if (!form.description.trim() || form.description.trim().length < 25) {
    errors.description = "Description must be at least 25 characters.";
  }

  if (!form.location.trim() || form.location.trim().length < 5) {
    errors.location = "Enter a valid location or landmark.";
  }

  if (form.phone && !/^\+?[0-9\s-]{8,16}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid mobile number.";
  }

  if (form.departmentName === "Water Supply" && form.tankerRequest && form.location.trim().length < 8) {
    errors.location = "Provide a more specific location for tanker dispatch.";
  }

  if (form.departmentName === "Electricity Board" && form.outageHours && Number(form.outageHours) < 0) {
    errors.outageHours = "Outage duration must be positive.";
  }

  return errors;
}

export default function FileComplaint() {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState(() => generateComplaintId(getComplaintCatalog().map((complaint) => complaint.id)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    departmentName: "",
    complaintType: "",
    priority: "medium",
    description: "",
    location: "",
    phone: "",
    isAnonymous: false,
    category: "",
    featureFlags: [],
    tankerRequest: false,
    outageHours: "",
    photoProof: false,
    geoTagged: false,
    emergencyTag: false,
    mapBasedIssue: false,
    sosRequested: false,
    documentUpload: false,
    routeTracking: false,
    schoolName: "",
    layoutNumber: "",
    animalType: "",
    deviceType: "",
    ispName: "",
    institutionType: "",
    feedbackRequested: false,
  });

  const { data: deptData } = useApi(() => departmentApi.list(), []);
  const backendDepartments = deptData?.departments || deptData || [];

  const departmentOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    for (const department of backendDepartments) {
      if (!department?.name || seen.has(department.name.toLowerCase())) continue;
      seen.add(department.name.toLowerCase());
      options.push({ id: department.id, name: department.name, icon: department.icon || "🏛️", source: "backend" });
    }

    for (const department of getComplaintDepartments()) {
      if (seen.has(department.name.toLowerCase())) continue;
      seen.add(department.name.toLowerCase());
      options.push({ id: department.id, name: department.name, icon: department.icon, source: "catalog" });
    }

    return options;
  }, [backendDepartments]);

  const selectedDepartment = findDepartmentCatalogEntry(form.departmentName);
  const selectedBackendDepartment = backendDepartments.find((department) => {
    if (!department?.name) return false;
    const normalized = department.name.toLowerCase();
    if (normalized === form.departmentName.toLowerCase()) return true;
    return (selectedDepartment?.aliases || []).some((alias) => alias.toLowerCase() === normalized);
  });

  const complaintTypes = getComplaintTypeOptions(form.departmentName);
  const featureOptions = getComplaintFeatureOptions(form.departmentName);

  const stepOneErrors = step === 1 ? validateDepartmentStep(form) : {};
  const stepTwoErrors = step === 2 ? validateDetailStep(form) : {};

  const selectedFeatureFlags = form.featureFlags;

  const toggleFeatureFlag = (flag) => {
    setForm((current) => ({
      ...current,
      featureFlags: current.featureFlags.includes(flag)
        ? current.featureFlags.filter((item) => item !== flag)
        : [...current.featureFlags, flag],
    }));
  };

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setAttachments((current) => [
      ...current,
      ...files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      })),
    ]);
    event.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((current) => current.filter((_, i) => i !== index));
  };

  const handleNext = async (event) => {
    event.preventDefault();

    if (step === 1) {
      const errors = validateDepartmentStep(form);
      if (Object.keys(errors).length > 0) {
        setError(Object.values(errors)[0]);
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      const errors = validateDetailStep(form);
      if (Object.keys(errors).length > 0) {
        setError(Object.values(errors)[0]);
        return;
      }
      setError("");
      setStep(3);
      return;
    }

    const validation = validateComplaintForm({
      title: form.title,
      department: form.departmentName,
      description: form.description,
      location: form.location,
      phone: form.phone,
    });

    if (!validation.valid) {
      setError(Object.values(validation.errors)[0] || "Fix the highlighted fields before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      department_id: selectedBackendDepartment?.id ? Number(selectedBackendDepartment.id) : undefined,
      department_name: form.departmentName,
      complaintType: form.complaintType,
      priority: form.priority,
      description: form.description.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      is_anonymous: form.isAnonymous,
      category: form.category || form.complaintType || undefined,
      featureFlags: selectedFeatureFlags,
      tankerRequest: form.tankerRequest,
      outageHours: form.outageHours || undefined,
      photoProof: form.photoProof,
      geoTagged: form.geoTagged,
      emergencyTag: form.emergencyTag,
      mapBasedIssue: form.mapBasedIssue,
      sosRequested: form.sosRequested,
      documentUpload: form.documentUpload,
      routeTracking: form.routeTracking,
      schoolName: form.schoolName || undefined,
      layoutNumber: form.layoutNumber || undefined,
      animalType: form.animalType || undefined,
      deviceType: form.deviceType || undefined,
      ispName: form.ispName || undefined,
      institutionType: form.institutionType || undefined,
      feedbackRequested: form.feedbackRequested,
      attachments: attachments.map((file) => file.name),
    };

    try {
      if (!selectedBackendDepartment?.id) {
        const record = submitComplaint(
          {
            ...payload,
            department: form.departmentName,
            evidenceCount: attachments.length,
            complaintType: form.complaintType,
            featureFlags: selectedFeatureFlags,
          },
          "Citizen",
        );
        setComplaintId(record.id);
      } else {
        const response = await complaintApi.create(payload);
        const complaint = response?.data || response;
        setComplaintId(normalizeComplaintId(complaint?.complaint_number || complaint?.number || complaint?.id || complaintId));
      }

      setSubmitted(true);
    } catch {
      const record = submitComplaint(
        {
          ...payload,
          department: form.departmentName,
          evidenceCount: attachments.length,
          complaintType: form.complaintType,
          featureFlags: selectedFeatureFlags,
        },
        "Citizen",
      );
      setComplaintId(record.id);
      setSubmitted(true);
      setError("Backend was unavailable, so the complaint was stored locally for demo tracking.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setAttachments([]);
    setError("");
    setForm({
      title: "",
      departmentName: "",
      complaintType: "",
      priority: "medium",
      description: "",
      location: "",
      phone: "",
      isAnonymous: false,
      category: "",
      featureFlags: [],
      tankerRequest: false,
      outageHours: "",
      photoProof: false,
      geoTagged: false,
      emergencyTag: false,
      mapBasedIssue: false,
      sosRequested: false,
      documentUpload: false,
      routeTracking: false,
      schoolName: "",
      layoutNumber: "",
      animalType: "",
      deviceType: "",
      ispName: "",
      institutionType: "",
      feedbackRequested: false,
    });
    setComplaintId(generateComplaintId(getComplaintCatalog().map((complaint) => complaint.id)));
  };

  const selectedDeptSummary = selectedDepartment || (form.departmentName ? { name: form.departmentName, icon: "🏛️", complaintTypes: [], features: [] } : null);

  if (submitted) {
    return (
      <Layout role="citizen">
        <div className="mx-auto max-w-2xl py-12">
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-lg">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <Sparkles className="h-4 w-4" /> Complaint Submitted
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Complaint Filed Successfully</h2>
            <p className="mt-3 text-lg text-slate-600">Your grievance has been registered and routed to the relevant department for swift resolution.</p>
            
            <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-5 shadow-sm">
              <p className="text-sm text-blue-700">Complaint ID:</p>
              <p className="mt-2 font-mono text-2xl font-bold tracking-wider text-blue-900">{complaintId}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-4">
                <ClipboardList className="h-5 w-5 text-sky-600" /> Complaint Summary
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Department</span>
                  <span className="font-semibold text-slate-900">{form.departmentName}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Complaint Type</span>
                  <span className="font-semibold text-slate-900">{form.complaintType}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Priority</span>
                  <span className="inline-flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${{"low": "bg-slate-400", "medium": "bg-sky-500", "high": "bg-orange-500", "urgent": "bg-red-500"}[form.priority]}`} /><span className="font-semibold capitalize text-slate-900">{form.priority}</span></span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Attachments</span>
                  <span className="font-semibold text-slate-900">{attachments.length} file(s)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30"
              >
                📝 File Another Complaint
              </button>
              <Link href="/citizen/track" className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
                📊 Track Status
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-600">
              You will receive email updates about your complaint status. Check back anytime to view details.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="citizen">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">📝 File a Complaint</h2>
            <p className="mt-2 text-lg text-slate-600">Submit your grievance with detailed information and let us route it to the right department.</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">End-to-End Service Routing</p>
                <p className="mt-1 text-xs text-blue-700">Your complaint will be automatically routed to the relevant department based on category and type.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-0 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          {steps.map((label, index) => {
            const currentStep = index + 1;
            const done = currentStep < step;
            const active = currentStep === step;
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${done ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : active ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20" : "bg-slate-200 text-slate-600"}`}>
                    {done ? <CheckCircle className="h-4 w-4" /> : currentStep}
                  </div>
                  <span className={`hidden text-sm font-semibold sm:block ${active ? "text-slate-900" : done ? "text-emerald-700" : "text-slate-600"}`}>{label}</span>
                </div>
                {index < steps.length - 1 && <div className={`mx-4 h-1 flex-1 rounded-full transition-all ${done ? "bg-emerald-400" : active ? "bg-blue-300" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleNext} className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Choose the department and the exact complaint type.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Complaint Title *</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    placeholder="e.g. Water leakage near community park"
                    value={form.title}
                    onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  />
                  {stepOneErrors.title && <p className="mt-1 text-xs font-medium text-red-600">{stepOneErrors.title}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Department *</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      value={form.departmentName}
                      onChange={(e) => setForm((current) => ({ ...current, departmentName: e.target.value, complaintType: "" }))}
                    >
                      <option value="">Select the relevant department</option>
                      {departmentOptions.map((department) => (
                        <option key={`${department.source}-${department.id}`} value={department.name}>
                          {department.icon} {department.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {stepOneErrors.departmentName && <p className="mt-1 text-xs font-medium text-red-600">{stepOneErrors.departmentName}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Complaint Type *</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      value={form.complaintType}
                      onChange={(e) => setForm((current) => ({ ...current, complaintType: e.target.value }))}
                      disabled={!form.departmentName}
                    >
                      <option value="">{form.departmentName ? "Select the complaint type" : "Choose a department first"}</option>
                      {complaintTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {stepOneErrors.complaintType && <p className="mt-1 text-xs font-medium text-red-600">{stepOneErrors.complaintType}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Priority Level</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setForm((current) => ({ ...current, priority: priority.value }))}
                        className={`rounded-xl border-2 px-3 py-2.5 text-xs font-bold capitalize transition-all ${form.priority === priority.value ? priority.active : priority.chip}`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Category Note</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    placeholder="Optional label such as road, electrical, sanitation, etc."
                    value={form.category}
                    onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
                  />
                </div>

                {selectedDepartment && (
                  <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-800">
                      <span className="text-lg">{selectedDepartment.icon}</span>
                      {selectedDepartment.name}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDepartment.features.map((feature) => (
                        <span key={feature} className="rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Complaint Details</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Add evidence-friendly details so the complaint reaches the right work queue.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Detailed Description *</label>
                  <div className="relative">
                    <textarea
                      required
                      rows={5}
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      placeholder="Describe what happened, when it started, how often it occurs, and why it needs attention..."
                      value={form.description}
                      onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setRecording((current) => !current)}
                      className={`absolute bottom-3 right-3 rounded-lg p-2 transition-all ${recording ? "animate-pulse bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-blue-50 hover:text-primary"}`}
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{form.description.length} characters</span>
                    <span>Minimum 25 characters</span>
                  </div>
                  {recording && <p className="mt-1 text-xs font-medium text-red-500">Recording... tap the mic to stop.</p>}
                  {stepTwoErrors.description && <p className="mt-1 text-xs font-medium text-red-600">{stepTwoErrors.description}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">
                      <MapPin className="mr-1 inline h-3.5 w-3.5" /> Location / Address *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      placeholder="Street, landmark, ward, or area name"
                      value={form.location}
                      onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                    />
                    {stepTwoErrors.location && <p className="mt-1 text-xs font-medium text-red-600">{stepTwoErrors.location}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-foreground">
                      <Phone className="mr-1 inline h-3.5 w-3.5" /> Contact Number
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                    />
                    {stepTwoErrors.phone && <p className="mt-1 text-xs font-medium text-red-600">{stepTwoErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Service Features</label>
                  <div className="flex flex-wrap gap-2">
                    {featureOptions.map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeatureFlag(feature)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${selectedFeatureFlags.includes(feature) ? "border-primary bg-blue-50 text-primary" : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDepartment?.name === "Water Supply" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-3">
                      <input type="checkbox" checked={form.tankerRequest} onChange={(e) => setForm((current) => ({ ...current, tankerRequest: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-sky-900">Tanker request needed</p>
                        <p className="text-xs text-sky-700">Request emergency water delivery for the affected location.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-3">
                      <input type="checkbox" checked={form.geoTagged} onChange={(e) => setForm((current) => ({ ...current, geoTagged: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-sky-900">Location-based tagging</p>
                        <p className="text-xs text-sky-700">Attach precise landmark details for faster routing.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Electricity Board" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Outage Duration (hours)</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                        placeholder="0"
                        value={form.outageHours}
                        onChange={(e) => setForm((current) => ({ ...current, outageHours: e.target.value }))}
                      />
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                      <input type="checkbox" checked={form.emergencyTag} onChange={(e) => setForm((current) => ({ ...current, emergencyTag: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Safety alert required</p>
                        <p className="text-xs text-amber-700">Mark the complaint for escalation on long outages or hazardous conditions.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Waste Management" && (
                  <label className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
                    <input type="checkbox" checked={form.photoProof} onChange={(e) => setForm((current) => ({ ...current, photoProof: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900">Photo proof attached</p>
                      <p className="text-xs text-orange-700">Recommended for garbage, dumping, or dead animal removal complaints.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Traffic Police" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
                      <input type="checkbox" checked={form.geoTagged} onChange={(e) => setForm((current) => ({ ...current, geoTagged: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Geo-location tagging</p>
                        <p className="text-xs text-red-700">Pin the incident to a live map point.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
                      <input type="checkbox" checked={form.emergencyTag} onChange={(e) => setForm((current) => ({ ...current, emergencyTag: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Emergency alert</p>
                        <p className="text-xs text-red-700">Flag the complaint for urgent traffic response.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Infrastructure" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <input type="checkbox" checked={form.mapBasedIssue} onChange={(e) => setForm((current) => ({ ...current, mapBasedIssue: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Map-based marking</p>
                        <p className="text-xs text-slate-700">Mark the road or footpath issue on a location map.</p>
                      </div>
                    </label>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Severity Tag</label>
                      <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}>
                        <option value="">Select severity</option>
                        <option value="minor">Minor</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedDepartment?.name === "Health Services" && (
                  <label className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <input type="checkbox" checked={form.emergencyTag} onChange={(e) => setForm((current) => ({ ...current, emergencyTag: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Emergency health tagging</p>
                      <p className="text-xs text-emerald-700">Route as a fast-track complaint for hospital or sanitation hazards.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Ambulance Services" && (
                  <label className="flex items-start gap-3 rounded-xl border border-pink-100 bg-pink-50 p-3">
                    <input type="checkbox" checked={form.sosRequested} onChange={(e) => setForm((current) => ({ ...current, sosRequested: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-pink-900">SOS integration</p>
                      <p className="text-xs text-pink-700">Flag the complaint for immediate emergency response.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Telecom Services" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">ISP / Provider</label>
                      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="e.g. Airtel, Jio, BSNL" value={form.ispName} onChange={(e) => setForm((current) => ({ ...current, ispName: e.target.value }))} />
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-3">
                      <input type="checkbox" checked={form.routeTracking} onChange={(e) => setForm((current) => ({ ...current, routeTracking: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Area outage detection</p>
                        <p className="text-xs text-purple-700">Use when the issue affects a broader network area.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Municipal Corporation" && (
                  <label className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                    <input type="checkbox" checked={form.documentUpload} onChange={(e) => setForm((current) => ({ ...current, documentUpload: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Document upload required</p>
                      <p className="text-xs text-amber-700">Useful for tax, bill, or certificate-delay complaints.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Police Department" && (
                  <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm((current) => ({ ...current, isAnonymous: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Anonymous reporting</p>
                      <p className="text-xs text-slate-700">Use secure filing for theft, harassment, or public disturbance cases.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Environment & Pollution" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
                      <input type="checkbox" checked={form.geoTagged} onChange={(e) => setForm((current) => ({ ...current, geoTagged: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Geo tagging</p>
                        <p className="text-xs text-green-700">Pin the pollution source or affected area.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
                      <input type="checkbox" checked={form.emergencyTag} onChange={(e) => setForm((current) => ({ ...current, emergencyTag: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Environmental alert</p>
                        <p className="text-xs text-green-700">Escalate illegal tree cutting or severe pollution cases.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Public Transport" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                      <input type="checkbox" checked={form.routeTracking} onChange={(e) => setForm((current) => ({ ...current, routeTracking: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">Route tracking</p>
                        <p className="text-xs text-indigo-700">Helpful for delays or overcrowding along bus routes.</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                      <input type="checkbox" checked={form.feedbackRequested} onChange={(e) => setForm((current) => ({ ...current, feedbackRequested: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">Feedback follow-up</p>
                        <p className="text-xs text-indigo-700">Allow transport staff to respond with route updates.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Education Department" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Institution Name</label>
                      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="School or college name" value={form.schoolName} onChange={(e) => setForm((current) => ({ ...current, schoolName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Complaint Focus</label>
                      <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" value={form.institutionType} onChange={(e) => setForm((current) => ({ ...current, institutionType: e.target.value }))}>
                        <option value="">Select complaint focus</option>
                        <option value="school issue">School issue</option>
                        <option value="fee complaint">Fee complaint</option>
                        <option value="infrastructure">Infrastructure</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedDepartment?.name === "Housing & Urban Development" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Layout / Plot Number</label>
                      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Layout number or plot reference" value={form.layoutNumber} onChange={(e) => setForm((current) => ({ ...current, layoutNumber: e.target.value }))} />
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3">
                      <input type="checkbox" checked={form.documentUpload} onChange={(e) => setForm((current) => ({ ...current, documentUpload: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-rose-900">Plan document upload</p>
                        <p className="text-xs text-rose-700">Attach layout approval or safety documents when available.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Fire Department" && (
                  <label className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
                    <input type="checkbox" checked={form.emergencyTag} onChange={(e) => setForm((current) => ({ ...current, emergencyTag: e.target.checked }))} className="mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">Emergency response priority</p>
                      <p className="text-xs text-red-700">Critical for fire hazards or safety violations.</p>
                    </div>
                  </label>
                )}

                {selectedDepartment?.name === "Animal Control" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Animal Type</label>
                      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Stray dog, cattle, dead animal..." value={form.animalType} onChange={(e) => setForm((current) => ({ ...current, animalType: e.target.value }))} />
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
                      <input type="checkbox" checked={form.feedbackRequested} onChange={(e) => setForm((current) => ({ ...current, feedbackRequested: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Removal scheduling</p>
                        <p className="text-xs text-green-700">Request pickup or veterinary routing details.</p>
                      </div>
                    </label>
                  </div>
                )}

                {selectedDepartment?.name === "Smart City / IoT Services" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-foreground">Device / Asset Type</label>
                      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Smart light, CCTV, public WiFi..." value={form.deviceType} onChange={(e) => setForm((current) => ({ ...current, deviceType: e.target.value }))} />
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <input type="checkbox" checked={form.geoTagged} onChange={(e) => setForm((current) => ({ ...current, geoTagged: e.target.checked }))} className="mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Device-level tagging</p>
                        <p className="text-xs text-blue-700">Useful for smart asset failure reporting and maintenance routing.</p>
                      </div>
                    </label>
                  </div>
                )}

                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center">
                  <FileUp className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">Attach evidence or documents</p>
                  <p className="mt-1 text-xs text-muted-foreground">Photos, PDFs, and supporting files help speed up triage.</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFilesSelected}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  />
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Add files
                    </button>
                    <button type="button" onClick={() => setAttachments([])} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Clear files
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{attachments.length} attachments staged</p>
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2 text-left">
                      {attachments.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <ImageIcon className="h-4 w-4 text-slate-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-800">{file.name}</p>
                            <p className="text-[11px] text-slate-500">{Math.max(1, Math.round(file.size / 1024))} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Review & Submit</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Confirm the complaint details before sending it to the service queue.</p>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={form.isAnonymous}
                    onChange={(e) => setForm((current) => ({ ...current, isAnonymous: e.target.checked }))}
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Submit anonymously</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Recommended for police, safety, or sensitive complaints.</p>
                  </div>
                </label>

                <div className="grid gap-3 rounded-2xl bg-muted/40 p-4 sm:grid-cols-2">
                  {[
                    { label: "Title", value: form.title || "—" },
                    { label: "Department", value: form.departmentName || "—" },
                    { label: "Complaint Type", value: form.complaintType || "—" },
                    { label: "Priority", value: form.priority },
                    { label: "Location", value: form.location || "—" },
                    { label: "Attachments", value: String(attachments.length) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-card p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-0.5 text-sm font-bold text-foreground capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-amber-700">
                    By submitting, you confirm the complaint is genuine and the information provided is accurate. False reports may lead to account restrictions.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <Tag className="h-4 w-4 text-sky-600" /> Smart complaint routing
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</p>
                  <p className="mt-1 font-semibold text-slate-950">{selectedDeptSummary?.name || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Types</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(complaintTypes.length > 0 ? complaintTypes : ["Choose a department first"]).slice(0, 5).map((type) => (
                      <span key={type} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Features</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(featureOptions.length > 0 ? featureOptions : ["Select a department to see features"]).slice(0, 5).map((feature) => (
                      <span key={feature} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Star className="h-4 w-4 text-amber-500" /> Filing tips
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Use the exact issue type to avoid misrouting.</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Add a location pin or detailed landmark whenever possible.</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Attach proof for sanitation, transport, and infrastructure issues.</li>
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2 flex gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setStep((current) => current - 1);
                  setError("");
                }}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Back
              </button>
            ) : (
              <div className="w-[88px]" />
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : step < 3 ? <ChevronDown className="h-4 w-4 -rotate-90" /> : <Send className="h-4 w-4" />}
              {step < 3 ? "Continue" : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}