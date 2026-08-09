export type UserRole = "CITIZEN" | "VOLUNTEER" | "AUTHORITY" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  reputation?: number;
  isVerified?: boolean;
  createdAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
