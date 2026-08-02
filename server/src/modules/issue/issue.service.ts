import { CreateIssueInput } from "./issue.validation";
import { createIssue } from "./issue.repository";

export const createIssueService = async (
  userId: string,
  data: CreateIssueInput,
) => {
  return createIssue({
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,

    createdBy: {
      connect: {
        id: userId,
      },
    },
  });
};
