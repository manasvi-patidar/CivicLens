import prisma from "../../config/prisma.js";

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

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "AUTHORITY" | "VOLUNTEER",
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      reputation: true,
      isVerified: true,
      createdAt: true,
    },
  });
};
