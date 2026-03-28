import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { SequelizeEnterpriseRepository } from "../../infrastructure/repositories/SequelizeEnterpriseRepository";

const createSchema = z.object({
  name: z.string().min(2),
  registrationNumber: z.string().min(3),
  address: z.string().min(5),
  city: z.string().min(2),
  country: z.string().min(2),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8),
});

export class EnterpriseController {
  constructor(private readonly repo: SequelizeEnterpriseRepository) {}

  /**
   * @swagger
   * /api/enterprises:
   *   get:
   *     tags: [Enterprises]
   *     summary: List all enterprises
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of enterprises
   */
  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const enterprises = await this.repo.findAll({ isActive: true });
      res.json({ success: true, data: enterprises });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/enterprises/{id}:
   *   get:
   *     tags: [Enterprises]
   *     summary: Get an enterprise by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   */
  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const enterprise = await this.repo.findById(req.params.id as string);
      if (!enterprise) {
        res
          .status(404)
          .json({ success: false, message: "Enterprise not found" });
        return;
      }
      res.json({ success: true, data: enterprise });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/enterprises:
   *   post:
   *     tags: [Enterprises]
   *     summary: Create a new enterprise
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
      const existing = await this.repo.findByRegistrationNumber(
        dto.registrationNumber,
      );
      if (existing) {
        res
          .status(409)
          .json({ success: false, message: "Enterprise already registered" });
        return;
      }
      const enterprise = await this.repo.create(dto);
      res.status(201).json({ success: true, data: enterprise });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/enterprises/{id}:
   *   patch:
   *     tags: [Enterprises]
   *     summary: Update an enterprise
   *     security:
   *       - bearerAuth: []
   */
  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updated = await this.repo.update(req.params.id as string, req.body);
      if (!updated) {
        res
          .status(404)
          .json({ success: false, message: "Enterprise not found" });
        return;
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/enterprises/{id}:
   *   delete:
   *     tags: [Enterprises]
   *     summary: Deactivate an enterprise
   *     security:
   *       - bearerAuth: []
   */
  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.repo.update(req.params.id as string, { isActive: false });
      res.json({ success: true, message: "Enterprise deactivated" });
    } catch (err) {
      next(err);
    }
  };
}
