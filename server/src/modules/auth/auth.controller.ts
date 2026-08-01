import { Request, Response } from "express";
import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import { asyncHandler } from "../../shared/errors/asyncHandler";
import { loginSchema } from "./auth.validation";
import { loginUser } from "./auth.service";

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
