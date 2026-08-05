import { CreateIssueInput } from "./issue.validation";
import { createIssue } from "./issue.repository";
import { getAllIssues } from "./issue.repository";

export const createIssueService = async (
  userId: string,
  data: CreateIssueInput,
) => {
  return createIssue({
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,

    createdBy: {
      connect: {
        id: userId,
      },
    },
  });
};

export const getAllIssuesService = async (
  page: number,
  limit: number,
  status?: string,
  category?: string,
  search?: string,
  sort: "asc" | "desc" = "desc",
) => {
  return getAllIssues(page, limit, status, category, search, sort);
};
