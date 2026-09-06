import type { Issue } from "../../../types/issue";

export const getDashboardStats = (issues: Issue[]) => {
  const totalIssues = issues.length;

  const openIssues = issues.filter((issue) => issue.status === "OPEN").length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "IN_PROGRESS",
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED",
  ).length;

  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === "HIGH",
  ).length;

  const assignedIssues = issues.filter(
    (issue) => issue.assignedToId !== null,
  ).length;

  const unassignedIssues = issues.filter(
    (issue) => issue.assignedToId === null,
  ).length;

  return {
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    highPriorityIssues,
    assignedIssues,
    unassignedIssues,
  };
};
