import { Router } from "express";
import { AssignChauffeurToCollectionUseCase } from "../../application/use-cases/waste-collection/AssignChauffeurToCollection";
import { CompleteWasteCollectionUseCase } from "../../application/use-cases/waste-collection/CompleteWasteCollection";
import { CreateWasteCollectionUseCase } from "../../application/use-cases/waste-collection/CreateWasteCollection";
import {
  authenticate,
  authorize,
} from "../../infrastructure/middleware/auth.middleware";
import { SequelizeChauffeurRepository } from "../../infrastructure/repositories/SequelizeChauffeurRepository";
import { SequelizeEnterpriseRepository } from "../../infrastructure/repositories/SequelizeEnterpriseRepository";
import { SequelizeWasteCollectionRepository } from "../../infrastructure/repositories/SequelizeWasteCollectionRepository";
import { WasteCollectionController } from "../controllers/WasteCollectionController";

const router = Router();

const collectionRepo = new SequelizeWasteCollectionRepository();
const enterpriseRepo = new SequelizeEnterpriseRepository();
const chauffeurRepo = new SequelizeChauffeurRepository();

const createUseCase = new CreateWasteCollectionUseCase(
  collectionRepo,
  enterpriseRepo,
);
const assignUseCase = new AssignChauffeurToCollectionUseCase(
  collectionRepo,
  chauffeurRepo,
);
const completeUseCase = new CompleteWasteCollectionUseCase(
  collectionRepo,
  chauffeurRepo,
);

const controller = new WasteCollectionController(
  createUseCase,
  assignUseCase,
  completeUseCase,
  collectionRepo,
);

router.use(authenticate);

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
router.post(
  "/",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.create,
);
router.patch(
  "/:id/assign",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.assignChauffeur,
);
router.patch(
  "/:id/complete",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER", "CHAUFFEUR"),
  controller.complete,
);
router.patch(
  "/:id/status",
  authorize("SUPER_ADMIN", "ENTERPRISE_MANAGER"),
  controller.updateStatus,
);

export default router;
