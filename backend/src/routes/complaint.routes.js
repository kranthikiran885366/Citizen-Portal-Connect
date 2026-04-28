import { Router } from "express";
import {
  createComplaint, getComplaint, trackComplaint, getComplaints,
  updateStatus, assignOfficer, rejectComplaint, rateComplaint,
  getSLABreaches, bulkUpdate
} from "../controllers/complaint.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody, validateComplaint } from "../middlewares/validate.middleware.js";

const router = Router();

// Public track route
router.get("/track/:number", trackComplaint);

// SLA and bulk (before /:id to avoid conflicts)
router.get("/sla-breaches", authenticate, authorize("admin", "officer"), getSLABreaches);
router.patch("/bulk", authenticate, authorize("admin", "officer"), bulkUpdate);
router.post("/bulk-update", authenticate, authorize("admin", "officer"), bulkUpdate); // legacy

// List and create
router.get("/", authenticate, getComplaints);
router.post("/", authenticate, authorize("citizen"), validateBody(validateComplaint), createComplaint);

// Single complaint operations
router.get("/:id", authenticate, getComplaint);
router.patch("/:id/status", authenticate, authorize("admin", "officer"), updateStatus);
router.patch("/:id/assign", authenticate, authorize("admin"), assignOfficer);
router.post("/:id/assign", authenticate, authorize("admin"), assignOfficer); // legacy
router.patch("/:id/reject", authenticate, authorize("admin", "officer"), rejectComplaint);
router.post("/:id/reject", authenticate, authorize("admin", "officer"), rejectComplaint); // legacy
router.post("/:id/rate", authenticate, authorize("citizen"), rateComplaint);

export default router;
