import { Response } from "express";
import { asyncHandler } from "../../shared/errors/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getUserContributionsService } from "./contribution.service";

export const getMyContributions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const contributions = await getUserContributionsService(req.user!.id);

    return res.status(200).json({
      success: true,
      data: contributions,
    });
  },
);
