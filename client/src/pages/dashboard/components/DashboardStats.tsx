interface DashboardStatsProps {
  loading: boolean;
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  highPriorityIssues: number;
  assignedIssues: number;
  unassignedIssues: number;
}

function DashboardStats({
  loading,
  totalIssues,
  openIssues,
  inProgressIssues,
  resolvedIssues,
  highPriorityIssues,
  assignedIssues,
  unassignedIssues,
}: DashboardStatsProps) {
  return (
    <>
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

          <p className="mt-1 text-sm text-slate-500">Issues awaiting action</p>
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
    </>
  );
}

export default DashboardStats;
