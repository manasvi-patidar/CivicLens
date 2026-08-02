import { Router } from "express";
import { createIssue } from "./issue.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, createIssue);

export default router;
