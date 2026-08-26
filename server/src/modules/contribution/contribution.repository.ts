import prisma from "../../config/prisma";

export const getUserContributionIssues = async (userId: string) => {
  return prisma.issue.findMany({
    where: {
      createdById: userId, //a citizen can only get their own contribution data
    },
    select: {
      id: true,
      status: true,
      category: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
