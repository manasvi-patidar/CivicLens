import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { createCommentSchema } from "./comment.validation";
import {
  createCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service";

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { content } = createCommentSchema.parse(req.body);

    const comment = await createCommentService(issueId, req.user!.id, content);

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const issueId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const comments = await getCommentsService(issueId);

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { content } = createCommentSchema.parse(req.body);

    const comment = await updateCommentService(
      commentId,
      req.user!.id,
      req.user!.role,
      content,
    );

    return res.json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await deleteCommentService(commentId, req.user!.id, req.user!.role);

    return res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
