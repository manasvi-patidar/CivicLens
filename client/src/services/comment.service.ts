import api from "./api";
import type {
  Comment,
  CommentListResponse,
  CreateCommentResponse,
} from "../types/comment";

export const getIssueComments = async (issueId: string): Promise<Comment[]> => {
  const response = await api.get<CommentListResponse>(
    `/issues/${issueId}/comments`,
  );

  return response.data.data;
};

export const createComment = async (
  issueId: string,
  content: string,
): Promise<CreateCommentResponse> => {
  const response = await api.post<CreateCommentResponse>(
    `/issues/${issueId}/comments`,
    {
      content,
    },
  );

  return response.data;
};

export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/comments/${id}`);
};

export const updateComment = async (
  id: string,
  content: string,
): Promise<Comment> => {
  const response = await api.patch<{ success: boolean; data: Comment }>(
    `/comments/${id}`,
    { content },
  );

  return response.data.data;
};
