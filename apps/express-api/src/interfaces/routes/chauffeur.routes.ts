import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../infrastructure/middleware/auth.middleware";
import { SequelizeChauffeurRepository } from "../../infrastructure/repositories/SequelizeChauffeurRepository";
import { ChauffeurController } from "../controllers/ChauffeurController";

const router = Router();
const repo = new SequelizeChauffeurRepository();
const controller = new ChauffeurController(repo);

router.use(authenticate);

router.get(
  "/available",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.getAvailable,
);
router.get(
  "/",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.getAll,
);
router.get(
  "/:id",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER", "CHAUFFEUR"),
  controller.getById,
);
router.patch(
  "/:id/location",
  authorize("CHAUFFEUR"),
  controller.updateLocation,
);
router.patch(
  "/:id/status",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER", "CHAUFFEUR"),
  controller.updateStatus,
);

export default router;
