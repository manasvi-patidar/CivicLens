import { CreateIssueInput } from "./issue.validation";
import { Prisma } from "@prisma/client";
import { createActivityService } from "../activity/activity.service";

import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
} from "./issue.repository";

export const createIssueService = async (
  userId: string,
  data: any,
  imageUrl?: string,
) => {
  const issueData: Prisma.IssueCreateInput = {
    ...data,

    imageUrl,

    createdBy: {
      connect: {
        id: userId,
      },
    },
  };

  const issue = await createIssue(issueData);

  await createActivityService({
    type: "ISSUE_CREATED",
    message: "Issue created",
    issue: {
      connect: {
        id: issue.id,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
  });

  return issue;
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

export const getIssueByIdService = async (id: string) => {
  const issue = await getIssueById(id);

  if (!issue) {
    throw new Error("Issue not found");
  }

  return issue;
};

export const updateIssueStatusService = async (
  id: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED",
) => {
  const issue = await getIssueById(id);

  if (!issue) {
    throw new Error("Issue not found");
  }

  return updateIssueStatus(id, status);
};
