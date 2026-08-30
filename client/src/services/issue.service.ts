import api from "./api";
import type {
  Issue,
  IssueCategory,
  IssueListResponse,
  IssueStatus,
} from "../types/issue";

interface GetIssuesParams {
  search?: string;
  category?: IssueCategory;
  status?: IssueStatus;
  page?: number;
  limit?: number;
}

interface IssueResponse {
  success: boolean;
  data: Issue;
}

interface CreateIssueResponse {
  success: boolean;
  message: string;
  data: Issue;
}

export interface UpdateIssueInput {
  title?: string;
  description?: string;
  category?: IssueCategory;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  latitude?: number;
  longitude?: number;
  address?: string;
}

interface UpdateIssueResponse {
  success: boolean;
  message: string;
  data: Issue;
}

export const getIssues = async (
  params?: GetIssuesParams,
): Promise<IssueListResponse> => {
  const response = await api.get<IssueListResponse>("/issues", {
    params,
  });

  return response.data;
};

export const getIssueById = async (id: string): Promise<Issue> => {
  const response = await api.get<IssueResponse>(`/issues/${id}`);

  return response.data.data;
};

export const createIssue = async (
  data: FormData,
): Promise<CreateIssueResponse> => {
  const response = await api.post<CreateIssueResponse>("/issues", data, {
    headers: {
      "Content-Type": undefined,
    },
  });

  return response.data;
};

export const deleteIssue = async (id: string): Promise<void> => {
  await api.delete(`/issues/${id}`);
};

export const updateIssue = async (
  id: string,
  data: UpdateIssueInput,
): Promise<UpdateIssueResponse> => {
  const response = await api.patch<UpdateIssueResponse>(`/issues/${id}`, data);

  return response.data;
};
