import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIssues } from "../../services/issue.service";
import type { Issue, IssueCategory, IssueStatus } from "../../types/issue";

const PAGE_SIZE = 10;

function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [status, setStatus] = useState<IssueStatus | "">("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIssues, setTotalIssues] = useState(0);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getIssues({
          search: search.trim() || undefined,
          category: category || undefined,
          status: status || undefined,
          page,
          limit: PAGE_SIZE,
        });

        setIssues(response.data);
        setTotalPages(Math.max(1, Math.ceil(response.count / PAGE_SIZE)));
        setTotalIssues(response.count);
      } catch {
        setError("Unable to load civic issues right now.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadIssues, 300);

    return () => clearTimeout(timer);
  }, [search, category, status, page]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: IssueCategory | "") => {
    setCategory(value);
    setPage(1);
  };

  const handleStatusChange = (value: IssueStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const hasFilters = Boolean(search || category || status);

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

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
          <div>
            <label htmlFor="search" className="label">
              Search
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                handleCategoryChange(e.target.value as IssueCategory | "")
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
              onChange={(e) =>
                handleStatusChange(e.target.value as IssueStatus | "")
              }
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

      {!loading && !error && totalIssues > 0 && (
        <p className="text-sm text-slate-500">
          Showing page {page} of {totalPages} · {totalIssues}{" "}
          {totalIssues === 1 ? "issue" : "issues"}
        </p>
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
        <>
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

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                disabled={page === 1}
                className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    pageNumber === page
                      ? "btn btn-primary"
                      : "btn btn-secondary"
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page === totalPages}
                className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default IssuesPage;
