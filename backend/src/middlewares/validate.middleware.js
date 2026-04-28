export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }
  next();
};

export const validateRegister = (body) => {
  const { name, email, password, role } = body;
  if (!name || name.trim().length < 2) return { error: "Name must be at least 2 characters" };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Valid email is required" };
  if (!password || password.length < 6) return { error: "Password must be at least 6 characters" };
  if (role && !["citizen", "officer", "admin"].includes(role)) return { error: "Invalid role" };
  return {};
};

export const validateLogin = (body) => {
  const { email, password } = body;
  if (!email) return { error: "Email is required" };
  if (!password) return { error: "Password is required" };
  return {};
};

export const validateComplaint = (body) => {
  const { title, description, department_id, priority } = body;
  if (!title || title.trim().length < 5) return { error: "Title must be at least 5 characters" };
  if (!description || description.trim().length < 10) return { error: "Description must be at least 10 characters" };
  if (!department_id) return { error: "Department is required" };
  if (priority && !["low", "medium", "high", "urgent"].includes(priority)) return { error: "Invalid priority" };
  return {};
};
