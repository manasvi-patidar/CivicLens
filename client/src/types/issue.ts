export type IssueCategory =
  | "ROAD"
  | "WATER"
  | "ELECTRICITY"
  | "GARBAGE"
  | "STREETLIGHT"
  | "DRAINAGE"
  | "PUBLIC_PROPERTY"
  | "OTHER";

export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export interface IssueUser {
  id: string;
  name: string;
  email?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  latitude: number;
  longitude: number;
  address: string | null;
  imageUrl: string | null;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: IssueUser;
}

export interface IssueListResponse {
  success: boolean;
  page: number;
  limit: number;
  count: number;
  data: Issue[];
}
