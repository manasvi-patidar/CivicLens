import { Router } from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  assignIssueController,
  deleteIssueController,
  updateIssueController,
} from "./issue.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { uploadIssueImage } from "../../middlewares/upload.middleware";
import commentRoutes from "../comment/comment.routes";

const router = Router();

router.get("/", getAllIssues);

router.post("/", protect, uploadIssueImage.single("image"), createIssue);

router.use("/:id/comments", commentRoutes);

router.get("/:id", getIssueById);

router.patch("/:id", protect, updateIssueController);

//only admin and authority can update the issue status
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN", "AUTHORITY"),
  updateIssueStatus,
);

router.patch("/:id/assign", protect, authorize("ADMIN"), assignIssueController);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN", "CITIZEN"),
  deleteIssueController,
);

export default router;
