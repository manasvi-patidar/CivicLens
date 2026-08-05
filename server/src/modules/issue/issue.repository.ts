import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const createIssue = async (data: Prisma.IssueCreateInput) => {
  return prisma.issue.create({
    data,
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const getAllIssues = async (
  page: number,
  limit: number,
  status?: string,
  category?: string,
  search?: string,
  sort: "asc" | "desc" = "desc",
) => {
  return prisma.issue.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(category && { category: category as any }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },

    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },

    orderBy: {
      createdAt: sort,
    },

    skip: (page - 1) * limit,

    take: limit,
  });
};
