import {
  createComment,
  getCommentsByIssueId,
  getCommentById,
  updateComment,
  deleteComment,
} from "./comment.repository";
import { AppError } from "../../shared/errors/AppError";
import { createActivityService } from "../activity/activity.service";

export const createCommentService = async (
  issueId: string,
  userId: string,
  content: string,
) => {
  const comment = await createComment({
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

  await createActivityService({
    type: "COMMENT_ADDED",
    message: "Comment added",
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

  return comment;
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
