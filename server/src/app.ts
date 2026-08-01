import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { errorHandler } from "./shared/errors/errorHandler";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.json({
    project: "CivicLens API",
    version: "1.0.0",
    status: "Running",
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CivicLens API is running",
  });
});

export default app;
