interface CitizenDashboardHeaderProps {
  userName?: string;
}

function CitizenDashboardHeader({ userName }: CitizenDashboardHeaderProps) {
  return (
    <div>
      <p className="text-sm font-medium text-teal-700">
        Open Civic Intelligence Platform
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        Welcome back, {userName} 👋
      </h1>

      <p className="text-muted mt-2">
        Help make your community better by reporting and tracking civic issues.
      </p>
    </div>
  );
}

export default CitizenDashboardHeader;
