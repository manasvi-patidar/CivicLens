import bcrypt from "bcrypt";

import prisma from "../../config/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { createUser, getAssignableUsers } from "./user.repository.js";

export const getAssignableUsersService = async () => {
  return getAssignableUsers();
};

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "AUTHORITY" | "VOLUNTEER";
}

export const createManagementUserService = async ({
  name,
  email,
  password,
  role,
}: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return createUser(name, email, hashedPassword, role);
};
