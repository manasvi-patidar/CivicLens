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
