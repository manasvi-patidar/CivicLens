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
