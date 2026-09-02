import type { Issue } from "../../../types/issue";
import type { User } from "../../../types/auth";

export const canEditIssue = (
  user: User | null,
  issue: Issue | null,
): boolean => {
  if (!user || !issue) return false;

  return (
    user.role === "ADMIN" ||
    (issue.createdById === user.id && issue.status === "OPEN")
  );
};

export const canDeleteIssue = (
  user: User | null,
  issue: Issue | null,
): boolean => {
  if (!user || !issue) return false;

  return (
    user.role === "ADMIN" ||
    (issue.createdById === user.id && issue.status === "OPEN")
  );
};
