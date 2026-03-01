import { Router } from "express";
import {
  createMonitor,
  getAllMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  triggerManualCheck,
} from "../controllers/apiMonitorController.js";
import {
  validate,
  validateObjectId,
} from "../middleware/validateMiddleware.js";
import {
  createMonitorSchema,
  updateMonitorSchema,
} from "../validators/apiMonitorValidator.js";

const router = Router();

router.post("/", validate(createMonitorSchema), createMonitor);
router.get("/", getAllMonitors);
router.get("/:id", validateObjectId, getMonitorById);

router.patch(
  "/:id",
  validateObjectId,
  validate(updateMonitorSchema),
  updateMonitor,
);
router.delete("/:id", validateObjectId, deleteMonitor);

// manual trigger
router.post("/:id/check", validateObjectId, triggerManualCheck);

export default router;
