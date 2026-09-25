import { useEffect, useState } from "react";
import { getIssues } from "../../../services/issue.service";
import type { Issue } from "../../../types/issue";

interface UseDashboardIssuesProps {
  isManagementUser: boolean;
  isVolunteer: boolean;
}

export const useDashboardIssues = ({
  isManagementUser,
  isVolunteer,
}: UseDashboardIssuesProps) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError("");

        const response = await getIssues({
          page: 1,
          limit: 1000,
        });

        setIssues(response.data);
      } catch {
        setError("Unable to load civic issues right now.");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [isManagementUser, isVolunteer]);

  return {
    issues,
    loading,
    error,
  };
};
