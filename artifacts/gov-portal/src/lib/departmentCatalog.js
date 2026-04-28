const departments = [
  {
    id: 1,
    name: "Water Supply",
    icon: "🚰",
    aliases: ["Water", "Water Supply Department"],
    color: "#0284c7",
    complaintTypes: ["No water supply", "Low pressure", "Water leakage", "Pipe burst", "Dirty/contaminated water"],
    features: ["Location-based issue tagging", "Emergency leak priority", "Tanker request option"],
  },
  {
    id: 2,
    name: "Electricity Board",
    icon: "⚡",
    aliases: ["Electricity", "Electricity Department"],
    color: "#ca8a04",
    complaintTypes: ["Power outage", "Voltage fluctuation", "Street light not working", "Transformer issue", "Billing issues"],
    features: ["Real-time outage tracking", "Auto escalation for long outages", "Safety alerts"],
  },
  {
    id: 3,
    name: "Waste Management",
    icon: "🗑️",
    aliases: ["Sanitation"],
    color: "#ea580c",
    complaintTypes: ["Garbage not collected", "Overflowing bins", "Illegal dumping", "Dead animal removal"],
    features: ["Schedule-based tracking", "Route optimization for trucks", "Photo proof required"],
  },
  {
    id: 4,
    name: "Traffic Police",
    icon: "🚦",
    aliases: ["Traffic"],
    color: "#dc2626",
    complaintTypes: ["Traffic signal not working", "Illegal parking", "Traffic congestion", "Road accidents"],
    features: ["Live traffic integration", "Geo-location tagging", "Emergency alerts"],
  },
  {
    id: 5,
    name: "Infrastructure",
    icon: "🏗️",
    aliases: ["Infrastructure / Roads", "Roads"],
    color: "#475569",
    complaintTypes: ["Potholes", "Road damage", "Footpath issues", "Construction delays"],
    features: ["Map-based complaint marking", "Severity-based prioritization"],
  },
  {
    id: 6,
    name: "Health Services",
    icon: "🏥",
    aliases: ["Health"],
    color: "#16a34a",
    complaintTypes: ["Hospital issues", "Ambulance delay", "Sanitation problems", "Public health hazards"],
    features: ["Emergency tagging", "Hospital mapping", "Fast-track escalation"],
  },
  {
    id: 7,
    name: "Ambulance Services",
    icon: "🚑",
    aliases: ["Ambulance"],
    color: "#db2777",
    complaintTypes: ["Ambulance not available", "Delay in service", "Emergency support"],
    features: ["Real-time ambulance tracking", "SOS integration"],
  },
  {
    id: 8,
    name: "Telecom Services",
    icon: "📡",
    aliases: ["Telecom"],
    color: "#7c3aed",
    complaintTypes: ["Network issues", "No signal", "Internet slow", "Cable damage"],
    features: ["ISP-based routing", "Area outage detection"],
  },
  {
    id: 9,
    name: "Municipal Corporation",
    icon: "🏛️",
    aliases: ["Municipal Services", "Municipal"],
    color: "#d97706",
    complaintTypes: ["Property tax issues", "Water bill issues", "Birth/death certificate delays"],
    features: ["Document upload", "Status tracking"],
  },
  {
    id: 10,
    name: "Police Department",
    icon: "🚓",
    aliases: ["Police"],
    color: "#0f172a",
    complaintTypes: ["Theft", "Harassment", "Public disturbance"],
    features: ["Secure complaint filing", "Anonymous reporting option"],
  },
  {
    id: 11,
    name: "Environment & Pollution",
    icon: "🌳",
    aliases: ["Environment", "Pollution"],
    color: "#059669",
    complaintTypes: ["Air pollution", "Noise pollution", "Illegal tree cutting", "Water pollution"],
    features: ["Environmental alerts", "Geo tagging"],
  },
  {
    id: 12,
    name: "Public Transport",
    icon: "🚏",
    aliases: ["Transport"],
    color: "#4f46e5",
    complaintTypes: ["Bus delays", "Overcrowding", "Driver complaints"],
    features: ["Route tracking", "Feedback system"],
  },
  {
    id: 13,
    name: "Education Department",
    icon: "🏫",
    aliases: ["Education"],
    color: "#0d9488",
    complaintTypes: ["School issues", "Fee complaints", "Infrastructure problems"],
    features: ["Institution tagging", "Document trail"],
  },
  {
    id: 14,
    name: "Housing & Urban Development",
    icon: "🏢",
    aliases: ["Housing", "Urban Development"],
    color: "#be123c",
    complaintTypes: ["Illegal construction", "Building safety issues", "Layout approvals"],
    features: ["Plan document upload", "Zone tagging", "Compliance escalation"],
  },
  {
    id: 15,
    name: "Fire Department",
    icon: "🔥",
    aliases: ["Fire"],
    color: "#dc2626",
    complaintTypes: ["Fire hazards", "Safety violations"],
    features: ["Emergency response priority"],
  },
  {
    id: 16,
    name: "Animal Control",
    icon: "🐄",
    aliases: ["Animal Control Department"],
    color: "#16a34a",
    complaintTypes: ["Stray animals", "Animal cruelty", "Dead animals"],
    features: ["Veterinary response routing", "Removal scheduling"],
  },
  {
    id: 17,
    name: "Smart City / IoT Services",
    icon: "💡",
    aliases: ["Smart City", "IoT Services"],
    color: "#2563eb",
    complaintTypes: ["Smart lights failure", "CCTV not working", "Public WiFi issues"],
    features: ["Device-level tagging", "Live asset monitoring"],
  },
];

export function getComplaintDepartments() {
  return departments;
}

export function findDepartmentCatalogEntry(value) {
  if (!value) return null;
  const target = String(value).trim().toLowerCase();
  return departments.find((department) => {
    if (String(department.id) === target) return true;
    if (department.name.toLowerCase() === target) return true;
    return department.aliases.some((alias) => alias.toLowerCase() === target);
  }) || null;
}

export function getComplaintTypeOptions(departmentNameOrId) {
  return findDepartmentCatalogEntry(departmentNameOrId)?.complaintTypes || [];
}

export function getComplaintFeatureOptions(departmentNameOrId) {
  return findDepartmentCatalogEntry(departmentNameOrId)?.features || [];
}

export function getDepartmentByBackendName(name) {
  return findDepartmentCatalogEntry(name);
}

export default departments;