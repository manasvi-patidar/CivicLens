import type { Issue } from "../../../types/issue";
import AssignedIssueList from "./AssignedIssueList";

interface ManagementAssignedIssuesProps {
  issues: Issue[];
  loading: boolean;
}

function ManagementAssignedIssues({
  issues,
  loading,
}: ManagementAssignedIssuesProps) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          My Assigned Issues
        </h2>

        <p className="text-muted mt-1 text-sm">
          Issues currently assigned to you for management.
        </p>
      </div>

      <AssignedIssueList
        issues={issues}
        loading={loading}
        emptyMessage="No issues are currently assigned to you."
      />
    </div>
  );
}

export default ManagementAssignedIssues;
