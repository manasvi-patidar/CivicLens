import { Request, Response } from "express";
import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import { asyncHandler } from "../../shared/errors/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const user = await registerUser(validatedData);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});
