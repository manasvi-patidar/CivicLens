import { getAssignableUsers } from "./user.repository";

export const getAssignableUsersService = async () => {
  return getAssignableUsers();
};
