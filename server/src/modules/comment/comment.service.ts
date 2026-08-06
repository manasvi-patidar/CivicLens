import {
  createComment,
  getCommentsByIssueId,
  getCommentById,
  updateComment,
  deleteComment,
} from "./comment.repository";
import { AppError } from "../../shared/errors/AppError";

export const createCommentService = async (
  issueId: string,
  userId: string,
  content: string,
) => {
  return createComment({
    content,

    issue: {
      connect: {
        id: issueId,
      },
    },

    user: {
      connect: {
        id: userId,
      },
    },
  });
};

export const getCommentsService = async (issueId: string) => {
  return getCommentsByIssueId(issueId);
};

export const updateCommentService = async (
  commentId: string,
  userId: string,
  role: string,
  content: string,
) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== userId && role !== "ADMIN") {
    throw new AppError("Unauthorized", 403);
  }

  return updateComment(commentId, content);
};

export const deleteCommentService = async (
  commentId: string,
  userId: string,
  role: string,
) => {
  const comment = await getCommentById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== userId && role !== "ADMIN") {
    throw new AppError("Unauthorized", 403);
  }

  await deleteComment(commentId);
};
