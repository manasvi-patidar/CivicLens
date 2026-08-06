import { Router } from "express";
import { createComment, getComments } from "./comment.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

router.post("/", protect, createComment);

router.get("/", getComments);

export default router;
