import { Response } from "express";
import { asyncHandler } from "../../shared/errors/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getAssignableUsersService } from "./user.service";

export const getAssignableUsersController = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const users = await getAssignableUsersService();

    return res.status(200).json({
      success: true,
      data: users,
    });
  },
);
