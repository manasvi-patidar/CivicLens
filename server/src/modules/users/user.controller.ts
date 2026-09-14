import { Response } from "express";

import { asyncHandler } from "../../shared/errors/asyncHandler.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";

import { createUserSchema } from "./user.validation.js";
import {
  createManagementUserService,
  getAssignableUsersService,
} from "./user.service.js";

export const getAssignableUsersController = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const users = await getAssignableUsersService();

    return res.status(200).json({
      success: true,
      data: users,
    });
  },
);

export const createUserController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createManagementUserService(validatedData);

    return res.status(201).json({
      success: true,
      message: `${user.role} user created successfully`,
      data: user,
    });
  },
);
