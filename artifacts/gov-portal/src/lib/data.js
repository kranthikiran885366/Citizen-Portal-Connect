export const departments = [
  { id: 1, name: "Traffic Police", icon: "🚦", color: "bg-red-500", complaints: 245, resolved: 198, pending: 47 },
  { id: 2, name: "Health Services", icon: "🏥", color: "bg-green-500", complaints: 312, resolved: 289, pending: 23 },
  { id: 3, name: "Water Supply", icon: "🚰", color: "bg-blue-500", complaints: 178, resolved: 145, pending: 33 },
  { id: 4, name: "Electricity Board", icon: "⚡", color: "bg-yellow-500", complaints: 421, resolved: 380, pending: 41 },
  { id: 5, name: "Waste Management", icon: "🗑️", color: "bg-orange-500", complaints: 156, resolved: 130, pending: 26 },
  { id: 6, name: "Ambulance Services", icon: "🚑", color: "bg-pink-500", complaints: 89, resolved: 85, pending: 4 },
  { id: 7, name: "Infrastructure", icon: "🏗️", color: "bg-gray-500", complaints: 267, resolved: 220, pending: 47 },
  { id: 8, name: "Telecom Services", icon: "📡", color: "bg-purple-500", complaints: 134, resolved: 110, pending: 24 },
  { id: 9, name: "Public Transport", icon: "🚌", color: "bg-indigo-500", complaints: 198, resolved: 165, pending: 33 },
  { id: 10, name: "Education", icon: "🏫", color: "bg-teal-500", complaints: 87, resolved: 75, pending: 12 },
  { id: 11, name: "Social Welfare", icon: "🤝", color: "bg-rose-500", complaints: 143, resolved: 125, pending: 18 },
  { id: 12, name: "Fire Department", icon: "🔥", color: "bg-red-600", complaints: 56, resolved: 54, pending: 2 },
  { id: 13, name: "Municipal Corporation", icon: "🏛️", color: "bg-amber-600", complaints: 334, resolved: 280, pending: 54 },
  { id: 14, name: "Parks & Recreation", icon: "🌳", color: "bg-emerald-500", complaints: 92, resolved: 78, pending: 14 },
  { id: 15, name: "Revenue Department", icon: "💼", color: "bg-cyan-600", complaints: 211, resolved: 190, pending: 21 },
];

export const complaints = [
  {
    id: "CMP-001",
    title: "Pothole on Main Road",
    category: "Infrastructure",
    department: "Infrastructure",
    status: "resolved",
    priority: "high",
    date: "2024-04-10",
    description: "Large pothole causing accidents near the market area.",
    citizen: "Rajesh Kumar",
    officer: "Suresh Singh",
    timeline: [
      { date: "2024-04-10", status: "submitted", note: "Complaint submitted" },
      { date: "2024-04-11", status: "acknowledged", note: "Assigned to infrastructure team" },
      { date: "2024-04-13", status: "in-progress", note: "Repair work initiated" },
      { date: "2024-04-15", status: "resolved", note: "Pothole filled and road repaired" },
    ],
    rating: 4,
    feedback: "Work done quickly and efficiently."
  },
  {
    id: "CMP-002",
    title: "Street Light Not Working",
    category: "Electricity",
    department: "Electricity Board",
    status: "in-progress",
    priority: "medium",
    date: "2024-04-12",
    description: "Three consecutive street lights are not working near the school.",
    citizen: "Meena Sharma",
    officer: "Anil Verma",
    timeline: [
      { date: "2024-04-12", status: "submitted", note: "Complaint submitted" },
      { date: "2024-04-13", status: "acknowledged", note: "Electrician assigned" },
      { date: "2024-04-14", status: "in-progress", note: "Parts ordered" },
    ],
    rating: null,
    feedback: null
  },
  {
    id: "CMP-003",
    title: "Water Supply Disruption",
    category: "Water",
    department: "Water Supply",
    status: "pending",
    priority: "high",
    date: "2024-04-14",
    description: "No water supply for 3 days in sector 5.",
    citizen: "Priya Patel",
    officer: null,
    timeline: [
      { date: "2024-04-14", status: "submitted", note: "Complaint submitted" },
    ],
    rating: null,
    feedback: null
  },
  {
    id: "CMP-004",
    title: "Garbage Not Collected",
    category: "Waste",
    department: "Waste Management",
    status: "resolved",
    priority: "low",
    date: "2024-04-08",
    description: "Garbage collection missed for a week in residential colony.",
    citizen: "Amit Gupta",
    officer: "Ravi Kumar",
    timeline: [
      { date: "2024-04-08", status: "submitted", note: "Complaint submitted" },
      { date: "2024-04-09", status: "acknowledged", note: "Sanitation team notified" },
      { date: "2024-04-10", status: "resolved", note: "Garbage collected" },
    ],
    rating: 5,
    feedback: "Very prompt response!"
  },
  {
    id: "CMP-005",
    title: "Traffic Signal Malfunction",
    category: "Traffic",
    department: "Traffic Police",
    status: "in-progress",
    priority: "high",
    date: "2024-04-13",
    description: "Signal at main junction showing red for all sides simultaneously.",
    citizen: "Sunita Rao",
    officer: "Inspector Sharma",
    timeline: [
      { date: "2024-04-13", status: "submitted", note: "Complaint submitted" },
      { date: "2024-04-13", status: "acknowledged", note: "Traffic police notified" },
      { date: "2024-04-14", status: "in-progress", note: "Technician dispatched" },
    ],
    rating: null,
    feedback: null
  },
  {
    id: "CMP-006",
    title: "Ambulance Response Delay",
    category: "Health",
    department: "Ambulance Services",
    status: "resolved",
    priority: "urgent",
    date: "2024-04-09",
    description: "Ambulance took 45 minutes to arrive for emergency call.",
    citizen: "Vikram Singh",
    officer: "Dr. Anand",
    timeline: [
      { date: "2024-04-09", status: "submitted", note: "Complaint submitted" },
      { date: "2024-04-09", status: "acknowledged", note: "Emergency services reviewing" },
      { date: "2024-04-11", status: "resolved", note: "Corrective measures implemented" },
    ],
    rating: 3,
    feedback: "Issue acknowledged and improvements promised."
  },
];

export const officers = [
  { id: 1, name: "Suresh Singh", department: "Infrastructure", assigned: 12, resolved: 10, pending: 2, rating: 4.5 },
  { id: 2, name: "Anil Verma", department: "Electricity Board", assigned: 18, resolved: 15, pending: 3, rating: 4.2 },
  { id: 3, name: "Ravi Kumar", department: "Waste Management", assigned: 22, resolved: 20, pending: 2, rating: 4.8 },
  { id: 4, name: "Inspector Sharma", department: "Traffic Police", assigned: 15, resolved: 11, pending: 4, rating: 4.0 },
  { id: 5, name: "Dr. Anand", department: "Ambulance Services", assigned: 8, resolved: 8, pending: 0, rating: 4.9 },
  { id: 6, name: "Kavita Joshi", department: "Water Supply", assigned: 14, resolved: 10, pending: 4, rating: 3.8 },
  { id: 7, name: "Mohan Das", department: "Health Services", assigned: 20, resolved: 18, pending: 2, rating: 4.4 },
  { id: 8, name: "Preethi Nair", department: "Telecom Services", assigned: 11, resolved: 9, pending: 2, rating: 4.1 },
];

export const auditLogs = [
  { id: 1, action: "Complaint CMP-001 resolved", user: "Suresh Singh", role: "Officer", time: "2024-04-15 14:30" },
  { id: 2, action: "Officer Anil Verma assigned to CMP-002", user: "Admin", role: "Admin", time: "2024-04-13 09:15" },
  { id: 3, action: "New complaint CMP-003 submitted", user: "Priya Patel", role: "Citizen", time: "2024-04-14 11:45" },
  { id: 4, action: "System settings updated", user: "Admin", role: "Admin", time: "2024-04-12 16:00" },
  { id: 5, action: "Complaint CMP-004 marked resolved", user: "Ravi Kumar", role: "Officer", time: "2024-04-10 12:20" },
  { id: 6, action: "New user registered: Sunita Rao", user: "System", role: "System", time: "2024-04-13 08:30" },
  { id: 7, action: "SLA breach alert triggered for CMP-003", user: "System", role: "System", time: "2024-04-16 09:00" },
];

export const statusColors = {
  "pending": "bg-yellow-100 text-yellow-800",
  "acknowledged": "bg-blue-100 text-blue-800",
  "in-progress": "bg-orange-100 text-orange-800",
  "resolved": "bg-green-100 text-green-800",
  "closed": "bg-gray-100 text-gray-800",
};

export const priorityColors = {
  "low": "bg-gray-100 text-gray-700",
  "medium": "bg-blue-100 text-blue-700",
  "high": "bg-orange-100 text-orange-700",
  "urgent": "bg-red-100 text-red-700",
};
