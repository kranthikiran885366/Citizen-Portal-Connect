export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://citizen-portal-connect.onrender.com/api"
    : "/api";
const STORAGE_KEY = "govcare.auth";
const SESSION_KEY = "govcare.auth.session";

export function getAuthSession() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveAuthSession(session) {
  const key = session.rememberMe ? STORAGE_KEY : SESSION_KEY;
  const storage = session.rememberMe ? localStorage : sessionStorage;
  storage.setItem(key, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function getDashboardPath(role) {
  if (role === "officer") return "/officer";
  if (role === "admin") return "/admin";
  return "/citizen";
}

let _refreshing = null;

export async function apiRequest(path, options = {}) {
  const session = getAuthSession();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (session?.accessToken) headers["Authorization"] = `Bearer ${session.accessToken}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (response.status === 401 && payload?.code === "TOKEN_EXPIRED" && session?.refreshToken) {
    if (!_refreshing) {
      _refreshing = fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      })
        .then((r) => r.json())
        .finally(() => { _refreshing = null; });
    }
    try {
      const refreshData = await _refreshing;
      if (refreshData?.data?.accessToken) {
        saveAuthSession({ ...session, accessToken: refreshData.data.accessToken, refreshToken: refreshData.data.refreshToken });
        headers["Authorization"] = `Bearer ${refreshData.data.accessToken}`;
        const retry = await fetch(`${API_BASE}${path}`, { ...options, headers });
        const retryPayload = await retry.json().catch(() => ({}));
        if (!retry.ok) throw new Error(retryPayload?.message || "Request failed");
        return retryPayload;
      }
    } catch {}
    clearAuthSession();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (response.status === 401) {
    clearAuthSession();
    window.location.href = "/login";
    throw new Error(payload?.message || "Unauthorized");
  }

  if (!response.ok) throw new Error(payload?.message || "Request failed");
  return payload;
}

const qs = (params) => {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null))
  ).toString();
  return q ? `?${q}` : "";
};

export const authApi = {
  login: (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout: (refresh_token) => apiRequest("/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token }) }),
  getMe: () => apiRequest("/auth/me"),
  updateProfile: (data) => apiRequest("/auth/me", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data) => apiRequest("/auth/me/password", { method: "PUT", body: JSON.stringify(data) }),
  getSettings: () => apiRequest("/auth/settings"),
  saveSetting: (key, value) => apiRequest("/auth/settings", { method: "PUT", body: JSON.stringify({ key, value }) }),
};

export const complaintApi = {
  list: (params = {}) => apiRequest(`/complaints${qs(params)}`),
  get: (id) => apiRequest(`/complaints/${id}`),
  track: (number) => apiRequest(`/complaints/track/${encodeURIComponent(number)}`),
  create: (data) => apiRequest("/complaints", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, status, note) => apiRequest(`/complaints/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) }),
  assign: (id, officer_id) => apiRequest(`/complaints/${id}/assign`, { method: "POST", body: JSON.stringify({ officer_id }) }),
  reject: (id, reason) => apiRequest(`/complaints/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
  rate: (id, rating, feedback) => apiRequest(`/complaints/${id}/rate`, { method: "POST", body: JSON.stringify({ rating, feedback }) }),
  getSLABreaches: (params = {}) => apiRequest(`/complaints/sla-breaches${qs(params)}`),
  bulkUpdate: (complaint_ids, status, note) => apiRequest("/complaints/bulk-update", { method: "POST", body: JSON.stringify({ complaint_ids, status, note }) }),
};

export const officerApi = {
  list: (params = {}) => apiRequest(`/officers${qs(params)}`),
  get: (id) => apiRequest(`/officers/${id}`),
  create: (data) => apiRequest("/officers", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/officers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/officers/${id}`, { method: "DELETE" }),
  myPerformance: () => apiRequest("/officers/my-performance"),
};

export const departmentApi = {
  list: () => apiRequest("/departments"),
  get: (id) => apiRequest(`/departments/${id}`),
  create: (data) => apiRequest("/departments", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/departments/${id}`, { method: "DELETE" }),
};

// Advanced Features API
export const advancedApi = {
  exportComplaints: (format = "csv", filters = {}) => apiRequest("/advanced/export", {
    method: "POST",
    body: JSON.stringify({ format, filters }),
  }),

  search: (query, filters = {}, page = 1, limit = 20) => apiRequest("/advanced/search", {
    method: "POST",
    body: JSON.stringify({ query, filters, page, limit }),
  }),

  escalateComplaint: (complaintId, reason, targetDepartmentId) => apiRequest(`/advanced/${complaintId}/escalate`, {
    method: "POST",
    body: JSON.stringify({ reason, targetDepartmentId }),
  }),

  addComment: (complaintId, content, isInternal = false) => apiRequest(`/advanced/${complaintId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, isInternal }),
  }),
  getComments: (complaintId) => apiRequest(`/advanced/${complaintId}/comments`),

  submitSurvey: (complaintId, satisfactionScore, feedback, suggestions) => apiRequest(`/advanced/${complaintId}/survey`, {
    method: "POST",
    body: JSON.stringify({ satisfactionScore, feedback, suggestions }),
  }),

  getPublicStatistics: () => apiRequest("/advanced/public/statistics"),

  getOfficerWorkload: () => apiRequest("/advanced/admin/workload"),
};

export const analyticsApi = {
  overview: () => apiRequest("/analytics/overview"),
  departmentStats: () => apiRequest("/analytics/departments"),
  complaintTrends: (days = 30) => apiRequest(`/analytics/trends?days=${days}`),
  officerPerformance: () => apiRequest("/analytics/officers"),
};

export const notificationApi = {
  list: (params = {}) => apiRequest(`/notifications${qs(params)}`),
  markRead: (id) => apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => apiRequest("/notifications/read-all", { method: "PATCH" }),
};

export const auditApi = {
  list: (params = {}) => apiRequest(`/audit-logs${qs(params)}`),
};
