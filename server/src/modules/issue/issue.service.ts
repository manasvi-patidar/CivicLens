import { CreateIssueInput } from "./issue.validation";
import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { createActivityService } from "../activity/activity.service";

import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  deleteIssue,
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

  const updatedIssue = await updateIssueStatus(id, status);

  await createActivityService({
    type: "STATUS_UPDATED",
    message: `Status changed from ${issue.status} to ${status}`,
    issue: {
      connect: {
        id: issue.id,
      },
    },
    user: {
      connect: {
        id: issue.createdById,
      },
    },
  });

  return updatedIssue;
};

export const assignIssueService = async (issueId: string, userId: string) => {
  const issue = await getIssueById(issueId);

  if (!issue) {
    throw new Error("Issue not found");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "VOLUNTEER" && user.role !== "AUTHORITY") {
    throw new Error("Issue can only be assigned to a volunteer or authority");
  }

  const updatedIssue = await assignIssue(issueId, userId);

  await createActivityService({
    type: "ISSUE_ASSIGNED",
    message: `Issue assigned to ${user.name}`,
    issue: {
      connect: {
        id: issueId,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
  });

  return updatedIssue;
};

export const deleteIssueService = async (id: string) => {
  const issue = await getIssueById(id);

  if (!issue) {
    throw new Error("Issue not found");
  }

  return deleteIssue(id);
};
