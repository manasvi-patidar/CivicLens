import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
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

      {/* Quick stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <p className="text-muted text-sm">My Reports</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          <p className="mt-1 text-sm text-slate-500">Issues reported by you</p>
        </div>

        <div className="card p-6">
          <p className="text-muted text-sm">Open Issues</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
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

      {/* Main action */}
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

      {/* Getting started */}
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
