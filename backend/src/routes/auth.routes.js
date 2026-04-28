import { Router } from "express";
import {
  register, login, refresh, logout, logoutAll,
  getMe, updateProfile, changePassword, getSettings, saveSetting
} from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody, validateRegister, validateLogin } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validateBody(validateRegister), register);
router.post("/login", validateBody(validateLogin), login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);

// Profile endpoints
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateProfile);
router.put("/me/password", authenticate, changePassword);

// Aliases used by frontend
router.put("/profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

// Settings (admin only)
router.get("/settings", authenticate, authorize("admin"), getSettings);
router.put("/settings", authenticate, authorize("admin"), saveSetting);

export default router;
