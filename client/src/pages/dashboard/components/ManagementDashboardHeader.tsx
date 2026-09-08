interface ManagementDashboardHeaderProps {
  error: string;
  userName?: string;
}

function ManagementDashboardHeader({
  error,
  userName,
}: ManagementDashboardHeaderProps) {
  return (
    <>
      <div>
        <p className="text-sm font-medium text-teal-700">
          Civic Management Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {userName} 👋
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
    </>
  );
}

export default ManagementDashboardHeader;
