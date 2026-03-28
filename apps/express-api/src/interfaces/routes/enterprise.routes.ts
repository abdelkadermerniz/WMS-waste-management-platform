import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../infrastructure/middleware/auth.middleware";
import { SequelizeEnterpriseRepository } from "../../infrastructure/repositories/SequelizeEnterpriseRepository";
import { EnterpriseController } from "../controllers/EnterpriseController";

const router = Router();
const repo = new SequelizeEnterpriseRepository();
const controller = new EnterpriseController(repo);

router.use(authenticate);

router.get(
  "/",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.getAll,
);
router.get(
  "/:id",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.getById,
);
router.post("/", authorize("SUPER_ADMIN"), controller.create);
router.patch("/:id", authorize("SUPER_ADMIN"), controller.update);
router.delete("/:id", authorize("SUPER_ADMIN"), controller.remove);

export default router;
