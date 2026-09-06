import type { Issue } from "../../../types/issue";

export const getAssignedIssues = (
  issues: Issue[],
  userId?: string,
): Issue[] => {
  return issues.filter(
    (issue) => issue.assignedToId === userId || issue.assignedTo?.id === userId,
  );
};
