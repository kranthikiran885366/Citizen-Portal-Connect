import { Router } from "express";
import { getLogs } from "../controllers/audit.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorize("admin"), getLogs);

export default router;
