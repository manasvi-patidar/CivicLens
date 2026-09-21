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
  const where = {
    ...(status && { status: status as any }),
    ...(category && { category: category as any }),
    ...(search && {
      title: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const [issues, total] = await Promise.all([
    prisma.issue.findMany({
      //findMany() → current page whereas count() → total matching records
      where,

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },

        assignedTo: {
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
    }),

    prisma.issue.count({
      where,
    }),
  ]);

  return {
    issues,
    total,
  };
};

export const getIssueById = async (id: string) => {
  return prisma.issue.findUnique({
    where: {
      id,
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
      assignedTo: {
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

export const updateIssueStatus = async (
  id: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED",
) => {
  return prisma.issue.update({
    where: {
      id,
    },
    data: {
      status,
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
  });
};

export const assignIssue = async (issueId: string, userId: string) => {
  return prisma.issue.update({
    where: {
      id: issueId,
    },
    data: {
      assignedTo: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      assignedTo: {
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

export const deleteIssue = async (id: string) => {
  return prisma.issue.delete({
    where: {
      id,
    },
  });
};

export const updateIssue = async (
  id: string,
  data: Prisma.IssueUpdateInput,
) => {
  return prisma.issue.update({
    where: {
      id,
    },
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
