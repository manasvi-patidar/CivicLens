import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

import {
  createUserController,
  getAssignableUsersController,
} from "./user.controller.js";

const router = Router();

router.post("/", protect, authorize("ADMIN"), createUserController);

router.get(
  "/assignable",
  protect,
  authorize("ADMIN"),
  getAssignableUsersController,
);

export default router;
