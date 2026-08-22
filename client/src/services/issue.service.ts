import api from "./api";
import type { IssueListResponse } from "../types/issue";

export const getIssues = async (): Promise<IssueListResponse> => {
  const response = await api.get<IssueListResponse>("/issues");

  return response.data;
};
