import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import {
  errorHandler,
  notFoundHandler,
} from "./infrastructure/middleware/error.middleware";
import { swaggerSpec } from "./infrastructure/swagger/swagger.config";

// Routes
import authRoutes from "./interfaces/routes/auth.routes";
import chauffeurRoutes from "./interfaces/routes/chauffeur.routes";
import collectionRoutes from "./interfaces/routes/collection.routes";
import enterpriseRoutes from "./interfaces/routes/enterprise.routes";

const app = express();

// ─── Core Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Health Check ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Swagger Docs ──────────────────────────────────────────
app.use("/api/docs", ...swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));

// ─── API Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/enterprises", enterpriseRoutes);
app.use("/api/chauffeurs", chauffeurRoutes);
app.use("/api/collections", collectionRoutes);

// ─── Error Handling ────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
