export type ActivityType =
  | "ISSUE_CREATED"
  | "STATUS_UPDATED"
  | "COMMENT_ADDED"
  | "ISSUE_ASSIGNED";

export interface ActivityUser {
  id: string;
  name: string;
  role: "CITIZEN" | "VOLUNTEER" | "AUTHORITY" | "ADMIN";
}

export interface IssueActivity {
  id: string;
  type: ActivityType;
  message: string;
  createdAt: string;
  user: ActivityUser;
}
