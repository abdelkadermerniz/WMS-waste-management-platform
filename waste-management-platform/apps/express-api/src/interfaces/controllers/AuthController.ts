import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../../application/use-cases/auth/AuthService";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z
    .enum(["SUPER_ADMIN", "ENTERPRISE_MANAGER", "CHAUFFEUR"])
    .default("ENTERPRISE_MANAGER"),
  enterpriseId: z.string().uuid().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     tags: [Auth]
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: Email already in use
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await this.authService.register(dto);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     tags: [Auth]
   *     summary: Login and receive JWT tokens
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await this.authService.login(dto);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     tags: [Auth]
   *     summary: Refresh access token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: New access token issued
   */
  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res
          .status(400)
          .json({ success: false, message: "refreshToken is required" });
        return;
      }
      const result = await this.authService.refreshAccessToken(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     tags: [Auth]
   *     summary: Logout and invalidate refresh token
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Logged out successfully
   */
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.authService.logout(req.user!.sub);
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  };

  /**
   * @swagger
   * /api/auth/me:
   *   get:
   *     tags: [Auth]
   *     summary: Get current user profile
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current authenticated user
   */
  me = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ success: true, data: req.user });
  };
}
