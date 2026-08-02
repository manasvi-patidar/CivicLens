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
