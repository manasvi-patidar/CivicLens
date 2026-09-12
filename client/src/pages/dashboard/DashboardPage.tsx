import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import AssignedIssueList from "./components/AssignedIssueList";
import { getDashboardStats } from "./utils/dashboard-stats";
import { getAssignedIssues } from "./utils/dashboard-filters";
import { getFilteredDashboardIssues } from "./utils/dashboard-issue-filters";
import { isManagementUser, isVolunteerUser } from "./utils/dashboard-roles";
import { useDashboardIssues } from "./hooks/useDashboardIssues";
import DashboardStats from "./components/DashboardStats";
import ManagementDashboardHeader from "./components/ManagementDashboardHeader";
import VolunteerDashboardStats from "./components/VolunteerDashboardStats";
import VolunteerWorkflow from "./components/VolunteerWorkflow";
import VolunteerDashboardHeader from "./components/VolunteerDashboardHeader";
import ManagementAssignedIssues from "./components/ManagementAssignedIssues";
import IssueManagementHeader from "./components/IssueManagementHeader";
import IssueManagementFilters from "./components/IssueManagementFilters";
import ManagementIssueList from "./components/ManagementIssueList";
import CitizenDashboardHeader from "./components/CitizenDashboardHeader";
import CitizenDashboardStats from "./components/CitizenDashboardStats";
import CitizenDashboardError from "./components/CitizenDashboardError";
import RecentIssues from "./components/RecentIssues";

function DashboardPage() {
  const { user } = useAuth();

  const managementUser = isManagementUser(user);
  const volunteerUser = isVolunteerUser(user);

  const { issues, loading, error } = useDashboardIssues({
    isManagementUser: managementUser,
    isVolunteer: volunteerUser,
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const myReports = issues.filter(
    (issue) => issue.createdById === user?.id,
  ).length;

  const assignedToMe = getAssignedIssues(issues, user?.id);

  const {
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    highPriorityIssues,
    assignedIssues,
    unassignedIssues,
  } = getDashboardStats(issues);

  const recentIssues = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  const filteredIssues = getFilteredDashboardIssues({
    issues,
    statusFilter,
    priorityFilter,
    categoryFilter,
    assignmentFilter,
    sortOrder,
  });

  if (volunteerUser) {
    return (
      <div className="space-y-8">
        <VolunteerDashboardHeader error={error} userName={user?.name} />

        <VolunteerDashboardStats
          loading={loading}
          assignedCount={assignedToMe.length}
          openCount={
            assignedToMe.filter((issue) => issue.status === "OPEN").length
          }
          inProgressCount={
            assignedToMe.filter((issue) => issue.status === "IN_PROGRESS")
              .length
          }
        />

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

          <AssignedIssueList
            issues={assignedToMe}
            loading={loading}
            emptyMessage="No issues are assigned to you yet."
            emptyDescription="Assigned civic issues will appear here when they are given to you."
            showEvidence
          />
        </div>

        <VolunteerWorkflow />
      </div>
    );
  }

  if (managementUser) {
    return (
      <div className="space-y-8">
        <ManagementDashboardHeader error={error} userName={user?.name} />

        <DashboardStats
          loading={loading}
          totalIssues={totalIssues}
          openIssues={openIssues}
          inProgressIssues={inProgressIssues}
          resolvedIssues={resolvedIssues}
          highPriorityIssues={highPriorityIssues}
          assignedIssues={assignedIssues}
          unassignedIssues={unassignedIssues}
        />

        <ManagementAssignedIssues issues={assignedToMe} loading={loading} />

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <IssueManagementHeader />
          </div>

          <div className="border-b border-slate-100 bg-slate-50 p-6">
            <IssueManagementFilters
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              categoryFilter={categoryFilter}
              assignmentFilter={assignmentFilter}
              sortOrder={sortOrder}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onCategoryChange={setCategoryFilter}
              onAssignmentChange={setAssignmentFilter}
              onSortChange={setSortOrder}
            />
          </div>

          <ManagementIssueList issues={filteredIssues} loading={loading} />

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
      <CitizenDashboardHeader userName={user?.name} />

      <CitizenDashboardStats
        loading={loading}
        myReports={myReports}
        openIssues={openIssues}
        reputation={user?.reputation ?? 0}
      />

      <CitizenDashboardError error={error} />

      <RecentIssues issues={recentIssues} loading={loading} />

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
