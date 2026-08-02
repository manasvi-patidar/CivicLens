import { Router } from "express";
import { register, login } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { getMe } from "./auth.controller";
import { authorize } from "../../middlewares/role.middleware";

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
