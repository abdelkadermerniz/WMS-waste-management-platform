import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { SequelizeChauffeurRepository } from "../../infrastructure/repositories/SequelizeChauffeurRepository";

const updateLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const updateStatusSchema = z.object({
  status: z.enum(["IDLE", "EN_ROUTE", "COMPLETED"]),
});

export class ChauffeurController {
  constructor(private readonly repo: SequelizeChauffeurRepository) {}

  /**
   * @swagger
   * /api/chauffeurs:
   *   get:
   *     tags: [Chauffeurs]
   *     summary: List all chauffeurs for the authenticated enterprise
   *     security:
   *       - bearerAuth: []
   */
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const enterpriseId =
        req.user!.role === "SUPER_ADMIN"
          ? (req.query.enterpriseId as string)
          : req.user!.enterpriseId!;

      if (!enterpriseId) {
        res
          .status(400)
          .json({ success: false, message: "enterpriseId is required" });
        return;
      }
      const chauffeurs = await this.repo.findAllByEnterprise(enterpriseId);
      res.json({ success: true, data: chauffeurs });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/chauffeurs/{id}:
   *   get:
   *     tags: [Chauffeurs]
   *     summary: Get a chauffeur by ID
   *     security:
   *       - bearerAuth: []
   */
  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const chauffeur = await this.repo.findById(req.params.id as string);
      if (!chauffeur) {
        res
          .status(404)
          .json({ success: false, message: "Chauffeur not found" });
        return;
      }
      res.json({ success: true, data: chauffeur });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/chauffeurs/{id}/location:
   *   patch:
   *     tags: [Chauffeurs]
   *     summary: Update chauffeur real-time location
   *     security:
   *       - bearerAuth: []
   */
  updateLocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { latitude, longitude } = updateLocationSchema.parse(req.body);
      await this.repo.updateLocation(req.params.id as string, latitude, longitude);
      res.json({ success: true, message: "Location updated" });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/chauffeurs/{id}/status:
   *   patch:
   *     tags: [Chauffeurs]
   *     summary: Update chauffeur status
   *     security:
   *       - bearerAuth: []
   */
  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      await this.repo.updateStatus(req.params.id as string, status);
      res.json({ success: true, message: `Status updated to ${status}` });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/chauffeurs/available:
   *   get:
   *     tags: [Chauffeurs]
   *     summary: List available (IDLE) chauffeurs for an enterprise
   *     security:
   *       - bearerAuth: []
   */
  getAvailable = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const enterpriseId =
        (req.query.enterpriseId as string) ?? req.user!.enterpriseId;
      if (!enterpriseId) {
        res
          .status(400)
          .json({ success: false, message: "enterpriseId is required" });
        return;
      }
      const chauffeurs = await this.repo.findAvailable(enterpriseId);
      res.json({ success: true, data: chauffeurs });
    } catch (err) {
      next(err);
    }
  };
}
