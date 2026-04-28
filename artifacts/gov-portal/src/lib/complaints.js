import { complaints as seedComplaints } from "@/lib/data";

const STORAGE_KEY = "govcare.custom-complaints.v1";

function safeParse(value) {
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadCustomComplaints() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveCustomComplaints(list) {
  if (typeof window === "undefined") {
    return list;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function getComplaintCatalog() {
  const customComplaints = loadCustomComplaints();
  return [...customComplaints, ...seedComplaints].sort((left, right) => right.date.localeCompare(left.date));
}

function formatComplaintDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toISOString().slice(0, 10);
}

export function normalizeComplaintRecord(raw) {
  if (!raw) return null;

  const id = String(raw.complaint_number || raw.number || raw.id || raw.complaintId || "").trim();
  const status = String(raw.status || "pending").toLowerCase();
  const timeline = Array.isArray(raw.timeline)
    ? raw.timeline
    : Array.isArray(raw.history)
      ? raw.history
      : [];

  return {
    id: id || generateComplaintId(),
    title: raw.title || raw.subject || "Untitled Complaint",
    category: raw.category || raw.department || raw.department_name || "General",
    department: raw.department || raw.department_name || raw.category || "General",
    status,
    priority: String(raw.priority || "medium").toLowerCase(),
    date: formatComplaintDate(raw.date || raw.created_at || raw.submitted_at),
    description: raw.description || raw.details || "",
    complaintType: raw.complaintType || raw.complaint_type || raw.issue_type || raw.category || "General",
    citizen: raw.citizen || raw.citizen_name || raw.name || "Anonymous",
    officer: raw.officer || raw.officer_name || raw.assigned_officer || null,
    location: raw.location || raw.address || "",
    phone: raw.phone || raw.mobile || "",
    anonymous: Boolean(raw.anonymous),
    featureFlags: raw.featureFlags || raw.feature_flags || raw.service_flags || [],
    timeline: timeline.length > 0 ? timeline : [{
      date: formatComplaintDate(raw.created_at || raw.date),
      status: status === "pending" ? "submitted" : status,
      note: raw.note || raw.message || "Complaint status updated",
    }],
    rating: raw.rating ?? null,
    feedback: raw.feedback ?? null,
    evidenceCount: raw.evidenceCount || raw.evidence_count || 0,
  };
}

export function findComplaintInCatalog(identifier) {
  const target = normalizeComplaintId(String(identifier || ""));
  return getComplaintCatalog().find((complaint) => normalizeComplaintId(complaint.id) === target);
}

export function generateComplaintId(existingIds = []) {
  let candidate = `CMP-${String(Math.floor(100 + Math.random() * 900))}`;

  while (existingIds.includes(candidate)) {
    candidate = `CMP-${String(Math.floor(100 + Math.random() * 900))}`;
  }

  return candidate;
}

export function normalizeComplaintId(value) {
  return value.trim().toUpperCase();
}

export function createComplaintRecord(form, citizenName, existingIds = []) {
  const id = generateComplaintId(existingIds);
  const today = new Date().toISOString().slice(0, 10);

  return {
    id,
    title: form.title.trim(),
    category: form.department,
    department: form.department,
    status: "pending",
    priority: form.priority,
    date: today,
    description: form.description.trim(),
    complaintType: form.complaintType || form.category || form.department,
    citizen: form.anonymous ? "Anonymous" : citizenName,
    officer: null,
    location: form.location.trim(),
    phone: form.phone.trim(),
    anonymous: form.anonymous,
    featureFlags: Array.isArray(form.featureFlags) ? form.featureFlags : [],
    timeline: [
      {
        date: today,
        status: "submitted",
        note: "Complaint submitted through the citizen portal",
      },
    ],
    rating: null,
    feedback: null,
    evidenceCount: form.evidenceCount || 0,
  };
}

export function submitComplaint(form, citizenName) {
  const catalog = getComplaintCatalog();
  const existingIds = catalog.map((complaint) => complaint.id);
  const record = createComplaintRecord(form, citizenName, existingIds);
  const customComplaints = loadCustomComplaints();
  const next = [record, ...customComplaints].filter(
    (complaint, index, list) => list.findIndex((item) => item.id === complaint.id) === index,
  );

  saveCustomComplaints(next);
  return record;
}

export function validateComplaintForm(form) {
  const errors = {};

  if (!form.title || form.title.trim().length < 8) {
    errors.title = "Complaint title must be at least 8 characters.";
  }

  if (!form.department) {
    errors.department = "Select the relevant department.";
  }

  if (!form.description || form.description.trim().length < 25) {
    errors.description = "Please describe the issue in at least 25 characters.";
  }

  if (!form.location || form.location.trim().length < 5) {
    errors.location = "Enter a valid location or landmark.";
  }

  if (form.phone && !/^\+?[0-9\s-]{8,16}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid mobile number.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function complaintStatusLabel(status) {
  return String(status || "").replaceAll("-", " ");
}

export function complaintPriorityLabel(priority) {
  return String(priority || "").toLowerCase();
}
