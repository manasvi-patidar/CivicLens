import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { errorHandler } from "./shared/errors/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import issueRoutes from "./modules/issue/issue.routes";
import commentManageRoutes from "./modules/comment/comment.manage.routes";
import activityRoutes from "./modules/activity/activity.routes";
import contributionRoutes from "./modules/contribution/contribution.routes";
import userRoutes from "./modules/users/user.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentManageRoutes);
app.use("/api", activityRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/users", userRoutes);
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
