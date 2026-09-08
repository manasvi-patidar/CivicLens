import { Link } from "react-router-dom";
import type { Issue } from "../../../types/issue";

interface ManagementIssueListProps {
  issues: Issue[];
  loading: boolean;
}

function ManagementIssueList({ issues, loading }: ManagementIssueListProps) {
  return (
    <div className="divide-y divide-slate-100">
      {loading ? (
        <div className="px-6 py-8 text-sm text-slate-500">
          Loading civic issues...
        </div>
      ) : issues.length === 0 ? (
        <div className="px-6 py-8">
          <p className="font-medium text-slate-900">
            No issues match the selected filters.
          </p>

          <p className="text-muted mt-1 text-sm">
            Try changing the filters to see more civic issues.
          </p>
        </div>
      ) : (
        issues.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="block px-6 py-5 transition hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate font-medium text-slate-900">
                  {issue.title}
                </h3>

                <p className="text-muted mt-1 text-sm">
                  {issue.category.replace("_", " ")}
                  {issue.address ? ` · ${issue.address}` : ""}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {issue.status.replace("_", " ")}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {issue.priority} priority
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {issue.assignedToId ? "Assigned" : "Unassigned"}
                  </span>
                </div>
              </div>

              <span className="shrink-0 text-xs text-slate-400">
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default ManagementIssueList;
