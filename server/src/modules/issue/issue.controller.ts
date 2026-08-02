import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createIssueSchema } from "./issue.validation";
import { createIssueService } from "./issue.service";

export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createIssueSchema.parse(req.body);

    const issue = await createIssueService(req.user!.id, validatedData);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
