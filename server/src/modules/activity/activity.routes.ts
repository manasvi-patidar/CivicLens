import { Router } from "express";
import { getIssueActivities } from "./activity.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/issues/:id/activities", protect, getIssueActivities);

export default router;
