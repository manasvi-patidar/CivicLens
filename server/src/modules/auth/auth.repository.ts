import prisma from "../../config/prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
  },
) => {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
};
