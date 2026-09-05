import api from "./api";

export interface IssueActivity {
  id: string;
  type: "ISSUE_CREATED" | "STATUS_UPDATED" | "COMMENT_ADDED" | "ISSUE_ASSIGNED";
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: "CITIZEN" | "VOLUNTEER" | "AUTHORITY" | "ADMIN";
  };
}

interface ActivityResponse {
  success: boolean;
  data: IssueActivity[];
}

export const getIssueActivities = async (
  issueId: string,
): Promise<IssueActivity[]> => {
  const response = await api.get<ActivityResponse>(
    `/issues/${issueId}/activities`,
  );

  return response.data.data;
};
