import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

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
import MakeImpact from "./components/MakeImpact";
import GettingStarted from "./components/GettingStarted";
import VolunteerAssignedIssues from "./components/VolunteerAssignedIssues";
import ManagementIssueFooter from "./components/ManagementIssueFooter";

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

        <VolunteerAssignedIssues issues={assignedToMe} loading={loading} />

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

          {!loading && filteredIssues.length > 0 && <ManagementIssueFooter />}
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

      <MakeImpact />

      <GettingStarted />
    </div>
  );
}

export default DashboardPage;
