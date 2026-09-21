import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createIssueSchema, updateIssueStatusSchema } from "./issue.validation";
import { updateIssueSchema } from "./issue.validation";
import { updateIssueService } from "./issue.service";
import { AppError } from "../../shared/errors/AppError";
import {
  createIssueService,
  getAllIssuesService,
  getIssueByIdService,
  updateIssueStatusService,
  assignIssueService,
  deleteIssueService,
} from "./issue.service";

export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = createIssueSchema.parse(req.body);

    const imageUrl = req.file ? (req.file as any).path : undefined;

    const issue = await createIssueService(
      req.user!.id,
      validatedData,
      imageUrl,
    );

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

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const status = req.query.status as string | undefined;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const sort = req.query.sort === "asc" ? "asc" : "desc";

    const { issues, total } = await getAllIssuesService(
      page,
      limit,
      status,
      category,
      search,
      sort,
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      count: total,
      data: issues,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const issue = await getIssueByIdService(id);

    return res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { status } = updateIssueStatusSchema.parse(req.body);

    const issue = await updateIssueStatusService(id, status);

    return res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: issue,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignIssueController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const issueId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { userId } = req.body;

    const issue = await assignIssueService(issueId, userId);

    return res.status(200).json({
      success: true,
      message: "Issue assigned successfully",
      data: issue,
    });
  },
);

export const deleteIssueController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const issueId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deleteIssueService(issueId, req.user!.id, req.user!.role);

    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  },
);

export const updateIssueController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError("Invalid issue ID", 400);
    }

    const validatedData = updateIssueSchema.parse(req.body);

    const updatedIssue = await updateIssueService(
      id,
      req.user!.id,
      validatedData,
    );

    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  },
);
