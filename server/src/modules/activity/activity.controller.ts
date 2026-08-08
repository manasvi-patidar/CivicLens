import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { getActivitiesService } from "./activity.service";

export const getIssueActivities = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const issueId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const activities = await getActivitiesService(issueId);

    return res.status(200).json({
      success: true,
      data: activities,
    });
  },
);
