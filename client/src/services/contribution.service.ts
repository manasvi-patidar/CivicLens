import api from "./api";

export interface ContributionData {
  total: number;
  resolved: number;
  inProgress: number;
  open: number;
  rejected: number;
  categories: Record<string, number>;
  dailyActivity: Record<string, number>;
}

interface ContributionResponse {
  success: boolean;
  data: ContributionData;
}

export const getMyContributions = async (): Promise<ContributionData> => {
  const response = await api.get<ContributionResponse>("/contributions/me");

  return response.data.data;
};
