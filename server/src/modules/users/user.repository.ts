import prisma from "../../config/prisma";

export const getAssignableUsers = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        in: ["VOLUNTEER", "AUTHORITY"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};
