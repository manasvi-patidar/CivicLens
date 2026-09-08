interface VolunteerDashboardStatsProps {
  loading: boolean;
  assignedCount: number;
  openCount: number;
  inProgressCount: number;
}

function VolunteerDashboardStats({
  loading,
  assignedCount,
  openCount,
  inProgressCount,
}: VolunteerDashboardStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="card p-6">
        <p className="text-muted text-sm">Assigned to Me</p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "—" : assignedCount}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Issues currently assigned to you
        </p>
      </div>

      <div className="card p-6">
        <p className="text-muted text-sm">Open</p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "—" : openCount}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Assigned issues waiting to be worked on
        </p>
      </div>

      <div className="card p-6">
        <p className="text-muted text-sm">In Progress</p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? "—" : inProgressCount}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Assigned issues currently being handled
        </p>
      </div>
    </div>
  );
}

export default VolunteerDashboardStats;
