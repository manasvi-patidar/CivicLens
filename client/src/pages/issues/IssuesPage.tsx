import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIssues } from "../../services/issue.service";
import type { Issue, IssueCategory, IssueStatus } from "../../types/issue";

function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [status, setStatus] = useState<IssueStatus | "">("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getIssues({
          search: search.trim() || undefined,
          category: category || undefined,
          status: status || undefined,
          page: 1,
          limit: 10,
        });

        setIssues(response.data);
      } catch {
        setError("Unable to load civic issues right now.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadIssues, 300);

    return () => clearTimeout(timer);
  }, [search, category, status]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
  };

  const hasFilters = search || category || status;

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

      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label htmlFor="search" className="label">
              Search
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
              className="input"
            />
          </div>

          <div>
            <label htmlFor="category" className="label">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as IssueCategory | "")
              }
              className="input"
            >
              <option value="">All categories</option>
              <option value="ROAD">Road</option>
              <option value="WATER">Water</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="GARBAGE">Garbage</option>
              <option value="STREETLIGHT">Streetlight</option>
              <option value="DRAINAGE">Drainage</option>
              <option value="PUBLIC_PROPERTY">Public Property</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="label">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus | "")}
              className="input"
            >
              <option value="">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-8">
          <p className="text-muted">Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No issues found
          </h2>

          <p className="text-muted mx-auto mt-2 max-w-md">
            Try changing your search or filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary mt-6"
            >
              Clear filters
            </button>
          )}
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
