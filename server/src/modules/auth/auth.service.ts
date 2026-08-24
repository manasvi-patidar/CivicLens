import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "./auth.repository";
import { AppError } from "../../shared/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";
import bcrypt from "bcrypt";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser(name, email, hashedPassword);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

interface LoginUserInput {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginUserInput) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    reputation: user.reputation,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
};

interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export const updateCurrentUser = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Email already in use", 409);
    }
  }

  const updatedUser = await updateUser(userId, data);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    reputation: updatedUser.reputation,
    isVerified: updatedUser.isVerified,
    createdAt: updatedUser.createdAt,
  };
};
