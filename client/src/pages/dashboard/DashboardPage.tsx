import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getIssues } from "../../services/issue.service";
import type { Issue } from "../../types/issue";

function DashboardPage() {
  const { user } = useAuth();

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

  const myReports = issues.filter(
    (issue) => issue.createdById === user?.id,
  ).length;

  const openIssues = issues.filter((issue) => issue.status === "OPEN").length;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-teal-700">
          Open Civic Intelligence Platform
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-muted mt-2">
          Help make your community better by reporting and tracking civic
          issues.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <p className="text-muted text-sm">My Reports</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : myReports}
          </p>

          <p className="mt-1 text-sm text-slate-500">Issues reported by you</p>
        </div>

        <div className="card p-6">
          <p className="text-muted text-sm">Open Issues</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "—" : openIssues}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Issues awaiting resolution
          </p>
        </div>

        <div className="card p-6">
          <p className="text-muted text-sm">Reputation</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {user?.reputation ?? 0}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your CivicLens reputation
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
          ) : recentIssues.length === 0 ? (
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
            recentIssues.map((issue) => (
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

      <div className="card overflow-hidden">
        <div className="p-7">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Make an impact
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              See something that needs attention?
            </h2>

            <p className="text-muted mt-2 leading-7">
              Report a civic issue with its location and supporting evidence.
              Your report can help turn an individual problem into useful
              community intelligence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/issues" className="btn btn-primary">
                View Issues
              </Link>

              <Link to="/issues/new" className="btn btn-secondary">
                Report an Issue
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Getting started
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <span className="text-sm font-semibold text-teal-700">01</span>

            <h3 className="mt-2 font-semibold text-slate-900">
              Report an issue
            </h3>

            <p className="text-muted mt-1 text-sm leading-6">
              Share a civic problem with a clear description and location.
            </p>
          </div>

          <div className="card p-5">
            <span className="text-sm font-semibold text-teal-700">02</span>

            <h3 className="mt-2 font-semibold text-slate-900">
              Track progress
            </h3>

            <p className="text-muted mt-1 text-sm leading-6">
              Follow the status of issues as they move through the resolution
              process.
            </p>
          </div>

          <div className="card p-5">
            <span className="text-sm font-semibold text-teal-700">03</span>

            <h3 className="mt-2 font-semibold text-slate-900">Stay involved</h3>

            <p className="text-muted mt-1 text-sm leading-6">
              Explore civic issues around you and contribute useful information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
