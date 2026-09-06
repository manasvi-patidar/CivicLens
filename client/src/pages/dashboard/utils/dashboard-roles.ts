import type { User } from "../../../types/auth";

export const isManagementUser = (user: User | null) => {
  return user?.role === "ADMIN" || user?.role === "AUTHORITY";
};

export const isVolunteerUser = (user: User | null) => {
  return user?.role === "VOLUNTEER";
};
