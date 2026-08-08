import { Prisma } from "@prisma/client";
import { createActivity, getActivitiesByIssue } from "./activity.repository";

export const createActivityService = (data: Prisma.ActivityCreateInput) => {
  return createActivity(data);
};

export const getActivitiesService = (issueId: string) => {
  return getActivitiesByIssue(issueId);
};
