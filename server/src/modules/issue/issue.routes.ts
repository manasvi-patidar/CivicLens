import { Router } from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
} from "./issue.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllIssues);

router.get("/:id", getIssueById);

router.post("/", protect, createIssue);

//only admin and authority can update the issue status
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN", "AUTHORITY"),
  updateIssueStatus,
);

export default router;
