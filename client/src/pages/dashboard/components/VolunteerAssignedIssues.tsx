import { Link } from "react-router-dom";
import type { Issue } from "../../../types/issue";
import AssignedIssueList from "./AssignedIssueList";

interface VolunteerAssignedIssuesProps {
  issues: Issue[];
  loading: boolean;
}

function VolunteerAssignedIssues({
  issues,
  loading,
}: VolunteerAssignedIssuesProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            My Assigned Issues
          </h2>

          <p className="text-muted mt-1 text-sm">
            Issues that have been assigned to you for review or field work.
          </p>
        </div>

        <Link
          to="/issues"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          All issues
        </Link>
      </div>

      <AssignedIssueList
        issues={issues}
        loading={loading}
        emptyMessage="No issues are assigned to you yet."
        emptyDescription="Assigned civic issues will appear here when they are given to you."
        showEvidence
      />
    </div>
  );
}

export default VolunteerAssignedIssues;
