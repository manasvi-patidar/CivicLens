interface CitizenDashboardStatsProps {
  loading: boolean;
  myReports: number;
  openIssues: number;
  reputation: number;
}

function CitizenDashboardStats({
  loading,
  myReports,
  openIssues,
  reputation,
}: CitizenDashboardStatsProps) {
  return (
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

        <p className="mt-2 text-3xl font-bold text-slate-900">{reputation}</p>

        <p className="mt-1 text-sm text-slate-500">Your CivicLens reputation</p>
      </div>
    </div>
  );
}

export default CitizenDashboardStats;
