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
  updateIssue,
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
  userId: string,
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
        id: userId,
      },
    },
  });

  return updatedIssue;
};

export const assignIssueService = async (
  issueId: string,
  userId: string, //person being assigned
  actorId: string, //logged-in admin/authority performing the assignment
) => {
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
        id: actorId,
      },
    },
  });

  return updatedIssue;
};

export const deleteIssueService = async (
  id: string,
  userId: string,
  userRole: string,
) => {
  const issue = await getIssueById(id);

  if (!issue) {
    throw new Error("Issue not found");
  }

  // Admin can delete any issue
  if (userRole === "ADMIN") {
    return deleteIssue(id);
  }

  // Issue creator can delete their own issue only while it is OPEN
  if (issue.createdById !== userId) {
    throw new Error("You can only delete your own issues");
  }

  if (issue.status !== "OPEN") {
    throw new Error("Only open issues can be deleted");
  }

  return deleteIssue(id);
};

export const updateIssueService = async (
  issueId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    category?:
      | "ROAD"
      | "WATER"
      | "ELECTRICITY"
      | "GARBAGE"
      | "STREETLIGHT"
      | "DRAINAGE"
      | "PUBLIC_PROPERTY"
      | "OTHER";
    priority?: "LOW" | "MEDIUM" | "HIGH";
    latitude?: number;
    longitude?: number;
    address?: string;
  },
) => {
  const issue = await getIssueById(issueId);

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.createdById !== userId) {
    throw new Error("You can only edit your own issues");
  }

  if (issue.status !== "OPEN") {
    throw new Error("Only open issues can be edited");
  }

  const updatedIssue = await updateIssue(issueId, data);

  return updatedIssue;
};
