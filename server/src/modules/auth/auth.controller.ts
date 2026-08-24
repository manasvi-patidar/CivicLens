import { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "./auth.validation";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
} from "./auth.service";
import { asyncHandler } from "../../shared/errors/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const user = await registerUser(validatedData);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await loginUser(validatedData);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res) => {
  const user = await getCurrentUser(req.user!.id);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await updateCurrentUser(req.user!.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  },
);
