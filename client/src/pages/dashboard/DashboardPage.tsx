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

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const isManagementUser = user?.role === "ADMIN" || user?.role === "AUTHORITY";

  const isVolunteer = user?.role === "VOLUNTEER";

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setError("");

        const response =
          isManagementUser || isVolunteer
            ? await getIssues({ page: 1, limit: 1000 })
            : await getIssues();

        setIssues(response.data);
      } catch {
        setError("Unable to load civic issues right now.");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, [isManagementUser, isVolunteer]);

  const myReports = issues.filter(
    (issue) => issue.createdById === user?.id,
  ).length;

  const assignedToMe = issues.filter(
    (issue) =>
      issue.assignedToId === user?.id || issue.assignedTo?.id === user?.id,
  );

  const totalIssues = issues.length;

  const openIssues = issues.filter((issue) => issue.status === "OPEN").length;

  const inProgressIssues = issues.filter(
    (issue) => issue.status === "IN_PROGRESS",
  ).length;

  const resolvedIssues = issues.filter(
    (issue) => issue.status === "RESOLVED",
  ).length;

  const highPriorityIssues = issues.filter(
    (issue) => issue.priority === "HIGH",
  ).length;

  const assignedIssues = issues.filter(
    (issue) => issue.assignedToId !== null,
  ).length;

  const unassignedIssues = issues.filter(
    (issue) => issue.assignedToId === null,
  ).length;

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const filteredIssues = [...issues]
    .filter((issue) => {
      if (statusFilter && issue.status !== statusFilter) {
        return false;
      }

      if (priorityFilter && issue.priority !== priorityFilter) {
        return false;
      }

      if (categoryFilter && issue.category !== categoryFilter) {
        return false;
      }

      if (assignmentFilter === "ASSIGNED" && issue.assignedToId === null) {
        return false;
      }

      if (assignmentFilter === "UNASSIGNED" && issue.assignedToId !== null) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const firstDate = new Date(a.createdAt).getTime();
      const secondDate = new Date(b.createdAt).getTime();

      return sortOrder === "newest"
        ? secondDate - firstDate
        : firstDate - secondDate;
    })
    .slice(0, 10);

  if (isVolunteer) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Volunteer Workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-muted mt-2">
            Review the civic issues assigned to you and help move them toward
            resolution.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <p className="text-muted text-sm">Assigned to Me</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : assignedToMe.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues currently assigned to you
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Open</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading
                ? "—"
                : assignedToMe.filter((issue) => issue.status === "OPEN")
                    .length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Assigned issues waiting to be worked on
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">In Progress</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading
                ? "—"
                : assignedToMe.filter((issue) => issue.status === "IN_PROGRESS")
                    .length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Assigned issues currently being handled
            </p>
          </div>
        </div>

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

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-6 py-8 text-sm text-slate-500">
                Loading assigned issues...
              </div>
            ) : assignedToMe.length === 0 ? (
              <div className="px-6 py-8">
                <p className="font-medium text-slate-900">
                  No issues are assigned to you yet.
                </p>

                <p className="text-muted mt-1 text-sm">
                  Assigned civic issues will appear here when they are given to
                  you.
                </p>
              </div>
            ) : (
              assignedToMe
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((issue) => (
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

                          {issue.imageUrl && (
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
                ))
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-7">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Volunteer workflow
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Work on assigned civic issues
              </h2>

              <p className="text-muted mt-2 leading-7">
                Open an assigned issue to review its description, location,
                evidence, comments, and activity history. Use the available
                actions for your role to contribute useful information.
              </p>

              <div className="mt-6">
                <Link to="/issues" className="btn btn-primary">
                  Browse Issues
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isManagementUser) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-teal-700">
            Civic Management Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-muted mt-2">
            Monitor civic issues, track progress, and manage community reports
            from one place.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <p className="text-muted text-sm">Total Issues</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : totalIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              All reported civic issues
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Open Issues</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : openIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues awaiting action
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">In Progress</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : inProgressIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues currently being handled
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Resolved</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : resolvedIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Successfully resolved issues
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6">
            <p className="text-muted text-sm">High Priority</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : highPriorityIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues requiring attention
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Assigned</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : assignedIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues assigned to staff
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Unassigned</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading ? "—" : unassignedIssues}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Issues awaiting assignment
            </p>
          </div>

          <div className="card p-6">
            <p className="text-muted text-sm">Resolution Rate</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {loading || totalIssues === 0
                ? "—"
                : `${Math.round((resolvedIssues / totalIssues) * 100)}%`}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Resolved vs total issues
            </p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                My Assigned Issues
              </h2>

              <p className="text-muted mt-1 text-sm">
                Issues specifically assigned to you.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-6 py-8 text-sm text-slate-500">
                Loading assigned issues...
              </div>
            ) : assignedToMe.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-500">
                No issues are currently assigned to you.
              </div>
            ) : (
              assignedToMe
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 5)
                .map((issue) => (
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
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-medium text-teal-700">
                        Open →
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Issue Management
              </h2>

              <p className="text-muted mt-1 text-sm">
                Filter and sort civic issues to quickly find the reports that
                need attention.
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="">All Categories</option>
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
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assignment
              </label>

              <select
                value={assignmentFilter}
                onChange={(event) => setAssignmentFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="">All Issues</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNASSIGNED">Unassigned</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sort
              </label>

              <select
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "newest" | "oldest")
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-6 py-8 text-sm text-slate-500">
                Loading civic issues...
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="px-6 py-8">
                <p className="font-medium text-slate-900">
                  No issues match the selected filters.
                </p>

                <p className="text-muted mt-1 text-sm">
                  Try changing the filters to see more civic issues.
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
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

          {!loading && filteredIssues.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-4">
              <Link
                to="/issues"
                className="text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                View all issues →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

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
