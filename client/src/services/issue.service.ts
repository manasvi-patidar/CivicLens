import api from "./api";
import type { Issue, IssueListResponse } from "../types/issue";

interface IssueResponse {
  success: boolean;
  data: Issue;
}

export const getIssues = async (): Promise<IssueListResponse> => {
  const response = await api.get<IssueListResponse>("/issues");

  return response.data;
};

export const getIssueById = async (id: string): Promise<Issue> => {
  const response = await api.get<IssueResponse>(`/issues/${id}`);

  return response.data.data;
};
