import pool from "./db.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const departments = [
      { name: "Traffic Police", icon: "🚦", color: "bg-red-500", sla_days: 3, description: "Handles traffic violations, signal issues, and road safety complaints" },
      { name: "Health Services", icon: "🏥", color: "bg-green-500", sla_days: 2, description: "Public health facilities, hospitals, and medical service complaints" },
      { name: "Water Supply", icon: "🚰", color: "bg-blue-500", sla_days: 5, description: "Water supply disruptions, quality issues, and pipeline complaints" },
      { name: "Electricity Board", icon: "⚡", color: "bg-yellow-500", sla_days: 3, description: "Power outages, billing issues, and electrical infrastructure complaints" },
      { name: "Waste Management", icon: "🗑️", color: "bg-orange-500", sla_days: 2, description: "Garbage collection, waste disposal, and sanitation complaints" },
      { name: "Ambulance Services", icon: "🚑", color: "bg-pink-500", sla_days: 1, description: "Emergency ambulance response and medical transport complaints" },
      { name: "Infrastructure", icon: "🏗️", color: "bg-gray-500", sla_days: 14, description: "Roads, bridges, public buildings, and civic infrastructure complaints" },
      { name: "Telecom Services", icon: "📡", color: "bg-purple-500", sla_days: 7, description: "Internet, telephone, and communication service complaints" },
      { name: "Public Transport", icon: "🚌", color: "bg-indigo-500", sla_days: 5, description: "Bus services, routes, and public transportation complaints" },
      { name: "Education", icon: "🏫", color: "bg-teal-500", sla_days: 10, description: "Schools, colleges, and educational facility complaints" },
      { name: "Social Welfare", icon: "🤝", color: "bg-rose-500", sla_days: 7, description: "Social welfare schemes, benefits, and assistance complaints" },
      { name: "Fire Department", icon: "🔥", color: "bg-red-600", sla_days: 1, description: "Fire safety, emergency response, and fire hazard complaints" },
      { name: "Municipal Corporation", icon: "🏛️", color: "bg-amber-600", sla_days: 10, description: "Municipal services, property tax, and civic administration complaints" },
      { name: "Parks & Recreation", icon: "🌳", color: "bg-emerald-500", sla_days: 7, description: "Parks, playgrounds, and recreational facility complaints" },
      { name: "Revenue Department", icon: "💼", color: "bg-cyan-600", sla_days: 14, description: "Land records, revenue collection, and property complaints" },
    ];

    for (const dept of departments) {
      await client.query(
        `INSERT INTO departments (name, icon, color, description, sla_days)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO NOTHING`,
        [dept.name, dept.icon, dept.color, dept.description, dept.sla_days]
      );
    }

    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING RETURNING id`,
      ["System Admin", "admin@govcare.gov.in", adminPassword, "1800000000", "admin"]
    );

    const officerData = [
      { name: "Suresh Singh", email: "suresh.singh@govcare.gov.in", dept: "Infrastructure", designation: "Senior Field Officer" },
      { name: "Anil Verma", email: "anil.verma@govcare.gov.in", dept: "Electricity Board", designation: "Electrical Inspector" },
      { name: "Ravi Kumar", email: "ravi.kumar@govcare.gov.in", dept: "Waste Management", designation: "Sanitation Officer" },
      { name: "Inspector Sharma", email: "sharma@govcare.gov.in", dept: "Traffic Police", designation: "Traffic Inspector" },
      { name: "Dr. Anand", email: "anand@govcare.gov.in", dept: "Ambulance Services", designation: "Medical Officer" },
      { name: "Kavita Joshi", email: "kavita.joshi@govcare.gov.in", dept: "Water Supply", designation: "Water Supply Engineer" },
      { name: "Mohan Das", email: "mohan.das@govcare.gov.in", dept: "Health Services", designation: "Health Inspector" },
      { name: "Preethi Nair", email: "preethi.nair@govcare.gov.in", dept: "Telecom Services", designation: "Telecom Officer" },
    ];

    const officerPassword = await bcrypt.hash("Officer@123", 12);
    let empCounter = 1;
    for (const o of officerData) {
      const deptResult = await client.query("SELECT id FROM departments WHERE name = $1", [o.dept]);
      if (!deptResult.rows.length) continue;
      const deptId = deptResult.rows[0].id;

      const userResult = await client.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, 'officer')
         ON CONFLICT (email) DO NOTHING RETURNING id`,
        [o.name, o.email, officerPassword]
      );

      if (userResult.rows.length) {
        const userId = userResult.rows[0].id;
        await client.query(
          `INSERT INTO officers (user_id, department_id, employee_id, designation)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id) DO NOTHING`,
          [userId, deptId, `EMP-${String(empCounter++).padStart(3, "0")}`, o.designation]
        );
      }
    }

    const citizenPassword = await bcrypt.hash("Citizen@123", 12);
    await client.query(
      `INSERT INTO users (name, email, password, phone, role, aadhaar)
       VALUES ($1, $2, $3, $4, 'citizen', $5)
       ON CONFLICT (email) DO NOTHING`,
      ["Rajesh Kumar", "rajesh.kumar@example.com", citizenPassword, "9876543210", "1234-5678-9012"]
    );

    await client.query("COMMIT");
    console.log("Seed completed successfully");
    console.log("Admin login: admin@govcare.gov.in / Admin@123");
    console.log("Officer login: suresh.singh@govcare.gov.in / Officer@123");
    console.log("Citizen login: rajesh.kumar@example.com / Citizen@123");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
