import { Router } from "express";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { getAssignableUsersController } from "./user.controller";

const router = Router();

router.get(
  "/assignable",
  protect,
  authorize("ADMIN"),
  getAssignableUsersController,
);

export default router;
