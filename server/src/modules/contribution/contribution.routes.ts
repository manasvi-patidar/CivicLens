import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getMyContributions } from "./contribution.controller";

const router = Router();

router.get("/me", protect, getMyContributions);

export default router;
