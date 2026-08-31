export interface CommentUser {
  id: string;
  name: string;
  role: string;
}

export interface Comment {
  id: string;
  content: string;
  issueId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
}

export interface CommentListResponse {
  success: boolean;
  data: Comment[];
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}
