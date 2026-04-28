import { Router } from "express";
import { dashboard, analytics, departmentStats, complaintTrends, officerPerformance } from "../controllers/analytics.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/overview", authenticate, authorize("admin"), dashboard);
router.get("/departments", authenticate, authorize("admin"), departmentStats);
router.get("/trends", authenticate, authorize("admin"), complaintTrends);
router.get("/officers", authenticate, authorize("admin"), officerPerformance);
router.get("/dashboard", authenticate, authorize("admin"), dashboard);
router.get("/", authenticate, authorize("admin"), analytics);

export default router;
