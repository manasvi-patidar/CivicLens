import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIssues } from "../../services/issue.service";
import type { Issue } from "../../types/issue";

function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError("");

        const response = await getIssues();
        setIssues(response.data);
      } catch {
        setError("Unable to load civic issues right now.");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Civic Issues
          </h1>

          <p className="text-muted mt-2">
            Explore issues reported by your community.
          </p>
        </div>

        <div className="card p-8">
          <p className="text-muted">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Civic Issues
          </h1>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Community reports</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Civic Issues
          </h1>

          <p className="text-muted mt-2">
            Explore issues reported by your community.
          </p>
        </div>

        <Link to="/issues/new" className="btn btn-primary">
          Report an Issue
        </Link>
      </div>

      {issues.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No issues yet
          </h2>

          <p className="text-muted mx-auto mt-2 max-w-md">
            There are no civic issues to display right now. You can be the first
            person to report one.
          </p>

          <Link to="/issues/new" className="btn btn-primary mt-6">
            Report an Issue
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {issue.imageUrl ? (
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-slate-50">
                  <span className="text-sm text-slate-400">
                    No image available
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                    {issue.category.replace("_", " ")}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {issue.status.replace("_", " ")}
                  </span>
                </div>

                <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-teal-700">
                  {issue.title}
                </h2>

                <p className="text-muted mt-2 line-clamp-2 text-sm leading-6">
                  {issue.description}
                </p>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="truncate text-sm text-slate-500">
                    {issue.address || "Location not provided"}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Priority: {issue.priority}
                    </span>

                    <span className="text-xs font-medium text-teal-700">
                      View details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default IssuesPage;
