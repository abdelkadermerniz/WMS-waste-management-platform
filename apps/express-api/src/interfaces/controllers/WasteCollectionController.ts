import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AssignChauffeurToCollectionUseCase } from "../../application/use-cases/waste-collection/AssignChauffeurToCollection";
import { CompleteWasteCollectionUseCase } from "../../application/use-cases/waste-collection/CompleteWasteCollection";
import { CreateWasteCollectionUseCase } from "../../application/use-cases/waste-collection/CreateWasteCollection";
import { SequelizeWasteCollectionRepository } from "../../infrastructure/repositories/SequelizeWasteCollectionRepository";

const createSchema = z.object({
  enterpriseId: z.string().uuid(),
  wasteType: z.enum(["ORGANIC", "RECYCLABLE", "HAZARDOUS", "GENERAL"]),
  estimatedWeight: z.number().positive(),
  collectionAddress: z.string().min(5),
  collectionLatitude: z.number().optional(),
  collectionLongitude: z.number().optional(),
  scheduledAt: z
    .string()
    .datetime()
    .transform((s) => new Date(s)),
  notes: z.string().optional(),
});

const assignSchema = z.object({ chauffeurId: z.string().uuid() });

const completeSchema = z.object({
  actualWeight: z.number().positive().optional(),
});

export class WasteCollectionController {
  constructor(
    private readonly createUseCase: CreateWasteCollectionUseCase,
    private readonly assignUseCase: AssignChauffeurToCollectionUseCase,
    private readonly completeUseCase: CompleteWasteCollectionUseCase,
    private readonly repo: SequelizeWasteCollectionRepository,
  ) {}

  /**
   * @swagger
   * /api/collections:
   *   get:
   *     tags: [WasteCollections]
   *     summary: List waste collection requests
   *     security:
   *       - bearerAuth: []
   */
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { status, enterpriseId } = req.query;
      let list;
      if (req.user?.role === "SUPER_ADMIN") {
        list = await this.repo.findAll({ status: status as any });
      } else {
        const entId = (enterpriseId as string) ?? req.user?.enterpriseId;
        list = await this.repo.findAllByEnterprise(entId!, {
          status: status as any,
        });
      }
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/collections/{id}:
   *   get:
   *     tags: [WasteCollections]
   *     summary: Get a collection by ID
   *     security:
   *       - bearerAuth: []
   */
  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const item = await this.repo.findById(req.params.id as string);
      if (!item) {
        res
          .status(404)
          .json({ success: false, message: "Collection not found" });
        return;
      }
      res.json({ success: true, data: item });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/collections:
   *   post:
   *     tags: [WasteCollections]
   *     summary: Create a new waste collection request
   *     security:
   *       - bearerAuth: []
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = createSchema.parse(req.body);
      const collection = await this.createUseCase.execute(dto);
      res.status(201).json({ success: true, data: collection });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/collections/{id}/assign:
   *   patch:
   *     tags: [WasteCollections]
   *     summary: Assign a chauffeur to a collection
   *     security:
   *       - bearerAuth: []
   */
  assignChauffeur = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { chauffeurId } = assignSchema.parse(req.body);
      const collection = await this.assignUseCase.execute({
        collectionId: req.params.id as string,
        chauffeurId,
        requesterId: req.user!.sub,
        requesterEnterpriseId: req.user?.enterpriseId,
      });
      res.json({ success: true, data: collection });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/collections/{id}/complete:
   *   patch:
   *     tags: [WasteCollections]
   *     summary: Mark a collection as completed
   *     security:
   *       - bearerAuth: []
   */
  complete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { actualWeight } = completeSchema.parse(req.body);
      const updated = await this.completeUseCase.execute({
        collectionId: req.params.id as string,
        status: "COMPLETED",
        actualWeight,
      });
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/collections/{id}/status:
   *   patch:
   *     tags: [WasteCollections]
   *     summary: Update a collection's status
   *     security:
   *       - bearerAuth: []
   */
  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { status } = req.body;
      const updated = await this.repo.updateStatus({
        collectionId: req.params.id as string,
        status,
      });
      if (!updated) {
        res
          .status(404)
          .json({ success: false, message: "Collection not found" });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };
}
