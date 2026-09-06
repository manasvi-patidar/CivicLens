import type { Issue } from "../../../types/issue";

interface FilterOptions {
  issues: Issue[];
  statusFilter: string;
  priorityFilter: string;
  categoryFilter: string;
  assignmentFilter: string;
  sortOrder: "newest" | "oldest";
}

export const getFilteredDashboardIssues = ({
  issues,
  statusFilter,
  priorityFilter,
  categoryFilter,
  assignmentFilter,
  sortOrder,
}: FilterOptions): Issue[] => {
  const filtered = issues.filter((issue) => {
    const matchesStatus = !statusFilter || issue.status === statusFilter;

    const matchesPriority =
      !priorityFilter || issue.priority === priorityFilter;

    const matchesCategory =
      !categoryFilter || issue.category === categoryFilter;

    const matchesAssignment =
      !assignmentFilter ||
      (assignmentFilter === "ASSIGNED" && issue.assignedToId !== null) ||
      (assignmentFilter === "UNASSIGNED" && issue.assignedToId === null);

    return (
      matchesStatus && matchesPriority && matchesCategory && matchesAssignment
    );
  });

  return filtered
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    })
    .slice(0, 10);
};
