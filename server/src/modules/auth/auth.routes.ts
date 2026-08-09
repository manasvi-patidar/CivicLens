import { Router } from "express";
import { register, login } from "./auth.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { getMe } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/admin-test", protect, authorize("ADMIN"), (_req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin!",
  });
});

export default router;
