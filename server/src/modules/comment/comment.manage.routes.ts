import { Router } from "express";
import { updateComment, removeComment } from "./comment.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.patch("/:id", protect, updateComment);

router.delete("/:id", protect, removeComment);

export default router;
