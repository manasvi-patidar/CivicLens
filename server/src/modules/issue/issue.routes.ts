import { Router } from "express";
import { createIssue, getAllIssues } from "./issue.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllIssues);
router.post("/", protect, createIssue);

export default router;
