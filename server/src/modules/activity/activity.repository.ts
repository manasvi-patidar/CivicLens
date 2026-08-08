import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const createActivity = async (data: Prisma.ActivityCreateInput) => {
  return prisma.activity.create({
    data,
  });
};

export const getActivitiesByIssue = async (issueId: string) => {
  return prisma.activity.findMany({
    where: {
      issueId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
