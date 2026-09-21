import api from "./api";
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  User,
} from "../types/auth";

export const registerUser = async (data: RegisterInput) => {
  const response = await api.post<{ data: User }>("/auth/register", data);

  return response.data.data;
};

export const loginUser = async (data: LoginInput) => {
  const response = await api.post<{ data: LoginResponse }>("/auth/login", data);

  localStorage.setItem("token", response.data.data.token);

  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<{ data: User }>("/auth/me");
  return response.data.data;
};

export const updateCurrentUser = async (data: {
  name?: string;
  email?: string;
}) => {
  const response = await api.patch("/auth/me", data);

  return response.data.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
