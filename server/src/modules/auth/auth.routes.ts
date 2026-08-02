import { Router } from "express";
import { register, login } from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { getMe } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
