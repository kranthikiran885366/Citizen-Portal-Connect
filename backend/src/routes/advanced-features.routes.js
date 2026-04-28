import { Router } from "express";
import {
  exportComplaints,
  advancedSearch,
  escalateComplaint,
  addComment,
  getComplaintComments,
  submitSurvey,
  getPublicStatistics,
  getOfficerWorkload
} from "../controllers/advanced-features.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// ============================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================

// Public statistics dashboard
router.get("/public/statistics", getPublicStatistics);

// ============================================
// PROTECTED ENDPOINTS
// ============================================

// Export complaints as CSV or JSON
router.post("/export", authenticate, exportComplaints);

// Advanced search with filters
router.post("/search", authenticate, advancedSearch);

// Escalation management
router.post("/:complaintId/escalate", authenticate, authorize("officer", "admin"), escalateComplaint);

// Comments and discussion threads
router.post("/:complaintId/comments", authenticate, addComment);
router.get("/:complaintId/comments", authenticate, getComplaintComments);

// Surveys and feedback
router.post("/:complaintId/survey", authenticate, authorize("citizen"), submitSurvey);

// Officer workload (Admin only)
router.get("/admin/workload", authenticate, authorize("admin"), getOfficerWorkload);

export default router;
