interface VolunteerDashboardHeaderProps {
  error: string;
  userName?: string;
}

function VolunteerDashboardHeader({
  error,
  userName,
}: VolunteerDashboardHeaderProps) {
  return (
    <>
      <div>
        <p className="text-sm font-medium text-teal-700">Volunteer Workspace</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {userName} 👋
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
    </>
  );
}

export default VolunteerDashboardHeader;
