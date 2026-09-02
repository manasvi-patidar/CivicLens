import { Link } from "react-router-dom";
import type { Issue } from "../../../types/issue";

interface IssueHeaderProps {
  issue: Issue;
  canEditIssue: boolean;
  canDeleteIssue: boolean;
  onDeleteClick: () => void;
}

function IssueHeader({
  issue,
  canEditIssue,
  canDeleteIssue,
  onDeleteClick,
}: IssueHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Link
          to="/issues"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to issues
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          {issue.title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Reported by {issue.createdBy?.name || "Unknown user"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {canEditIssue && (
          <Link
            to={`/issues/${issue.id}/edit`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit Issue
          </Link>
        )}

        {canDeleteIssue && (
          <button
            type="button"
            onClick={onDeleteClick}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete Issue
          </button>
        )}
      </div>
    </div>
  );
}

export default IssueHeader;
