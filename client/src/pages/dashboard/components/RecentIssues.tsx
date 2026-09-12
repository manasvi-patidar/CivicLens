import { Link } from "react-router-dom";
import type { Issue } from "../../../types/issue";

interface RecentIssuesProps {
  issues: Issue[];
  loading: boolean;
}

function RecentIssues({ issues, loading }: RecentIssuesProps) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Issues
          </h2>

          <p className="text-muted mt-1 text-sm">
            Latest civic issues reported on CivicLens.
          </p>
        </div>

        <Link
          to="/issues"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="px-6 py-8 text-sm text-slate-500">
            Loading recent issues...
          </div>
        ) : issues.length === 0 ? (
          <div className="px-6 py-8">
            <p className="font-medium text-slate-900">
              No issues reported yet.
            </p>

            <p className="text-muted mt-1 text-sm">
              Be the first to report a civic issue in your community.
            </p>

            <Link to="/issues/new" className="btn btn-primary mt-4">
              Report an Issue
            </Link>
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
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {issue.status.replace("_", " ")}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentIssues;
