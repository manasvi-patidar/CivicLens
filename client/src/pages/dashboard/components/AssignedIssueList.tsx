import { Link } from "react-router-dom";
import type { Issue } from "../../../types/issue";

interface AssignedIssueListProps {
  issues: Issue[];
  loading: boolean;
  emptyMessage: string;
  emptyDescription?: string;
  limit?: number;
  showEvidence?: boolean;
}

function AssignedIssueList({
  issues,
  loading,
  emptyMessage,
  emptyDescription,
  limit,
  showEvidence = false,
}: AssignedIssueListProps) {
  const displayedIssues = issues
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);

  if (loading) {
    return (
      <div className="px-6 py-8 text-sm text-slate-500">
        Loading assigned issues...
      </div>
    );
  }

  if (displayedIssues.length === 0) {
    return (
      <div className="px-6 py-8">
        <p className="font-medium text-slate-900">{emptyMessage}</p>

        {emptyDescription && (
          <p className="text-muted mt-1 text-sm">{emptyDescription}</p>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {displayedIssues.map((issue) => (
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

                {showEvidence && issue.imageUrl && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Evidence attached
                  </span>
                )}
              </div>
            </div>

            <span className="shrink-0 text-sm font-medium text-teal-700">
              Open →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AssignedIssueList;
