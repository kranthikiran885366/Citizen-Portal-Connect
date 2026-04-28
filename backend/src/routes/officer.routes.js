import { Router } from "express";
import { getOfficers, getOfficer, createOfficer, updateOfficer, deleteOfficer, getMyPerformance } from "../controllers/officer.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), getOfficers);
router.post("/", authenticate, authorize("admin"), createOfficer);
router.get("/my-performance", authenticate, authorize("officer"), getMyPerformance);
router.get("/:id", authenticate, authorize("admin", "officer"), getOfficer);
router.put("/:id", authenticate, authorize("admin"), updateOfficer);
router.delete("/:id", authenticate, authorize("admin"), deleteOfficer);

export default router;
