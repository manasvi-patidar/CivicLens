import { Router } from "express";
import { createIssue, getAllIssues, getIssueById } from "./issue.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.post("/", protect, createIssue);

export default router;
