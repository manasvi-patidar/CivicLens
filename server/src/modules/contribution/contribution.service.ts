import {
  getUserContributionActivities,
  getUserContributionIssues,
} from "./contribution.repository";

interface ContributionIssue {
  id: string;
  status: string;
  category: string;
  createdAt: Date;
}

interface ContributionActivity {
  id: string;
  type: string;
  createdAt: Date;
}

export const getUserContributionsService = async (userId: string) => {
  const issues: ContributionIssue[] = await getUserContributionIssues(userId);

  const activities: ContributionActivity[] =
    await getUserContributionActivities(userId);

  const total = issues.length;

  const resolved = issues.filter((issue) => issue.status === "RESOLVED").length;

  const inProgress = issues.filter(
    (issue) => issue.status === "IN_PROGRESS",
  ).length;

  const open = issues.filter((issue) => issue.status === "OPEN").length;

  const rejected = issues.filter((issue) => issue.status === "REJECTED").length;

  const categories = issues.reduce<Record<string, number>>((result, issue) => {
    result[issue.category] = (result[issue.category] || 0) + 1;

    return result;
  }, {});

  const dailyActivity = activities.reduce<Record<string, number>>(
    (result, activity) => {
      const date = activity.createdAt.toISOString().split("T")[0];

      result[date] = (result[date] || 0) + 1;

      return result;
    },
    {},
  );

  return {
    total,
    resolved,
    inProgress,
    open,
    rejected,
    categories,
    dailyActivity,
  };
};
