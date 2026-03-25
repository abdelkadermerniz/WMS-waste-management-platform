import { Router } from "express";
import { AuthService } from "../../application/use-cases/auth/AuthService";
import { authenticate } from "../../infrastructure/middleware/auth.middleware";
import { SequelizeUserRepository } from "../../infrastructure/repositories/SequelizeUserRepository";
import { AuthController } from "../controllers/AuthController";

const router = Router();

const userRepo = new SequelizeUserRepository();
const authService = new AuthService(userRepo);
const controller = new AuthController(authService);

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

export default router;
