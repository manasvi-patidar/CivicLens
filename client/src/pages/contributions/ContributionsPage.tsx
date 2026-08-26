import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyContributions } from "../../services/contribution.service";
import type { ContributionData } from "../../services/contribution.service";

const categoryLabels: Record<string, string> = {
  ROAD: "Road",
  WATER: "Water",
  ELECTRICITY: "Electricity",
  GARBAGE: "Garbage",
  STREETLIGHT: "Streetlight",
  DRAINAGE: "Drainage",
  PUBLIC_PROPERTY: "Public Property",
  OTHER: "Other",
};

function ContributionsPage() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        setError("");

        const contributionData = await getMyContributions();
        setData(contributionData);
      } catch {
        setError("Unable to load your contribution data.");
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, []);

  const categoryEntries = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.entries(data.categories).sort(
      ([, first], [, second]) => second - first,
    );
  }, [data]);

  const activityEntries = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.entries(data.dailyActivity).sort(
      ([first], [second]) =>
        new Date(first).getTime() - new Date(second).getTime(),
    );
  }, [data]);

  const maxActivity = useMemo(() => {
    if (activityEntries.length === 0) {
      return 0;
    }

    return Math.max(...activityEntries.map(([, count]) => count));
  }, [activityEntries]);

  const getActivityClass = (count: number) => {
    if (count === 0) {
      return "bg-slate-100";
    }

    if (maxActivity <= 1) {
      return "bg-teal-300";
    }

    const ratio = count / maxActivity;

    if (ratio <= 0.25) {
      return "bg-teal-200";
    }

    if (ratio <= 0.5) {
      return "bg-teal-300";
    }

    if (ratio <= 0.75) {
      return "bg-teal-500";
    }

    return "bg-teal-700";
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="card p-8">
          <p className="text-sm text-slate-500">
            Loading your contributions...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Contributions unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "Something went wrong while loading your contributions."}
          </p>

          <Link to="/" className="btn btn-primary mt-5 inline-flex">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Community Impact</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Contributions
        </h1>

        <p className="text-muted mt-2">
          Track your civic participation and see how your reports contribute to
          the community.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <p className="text-sm text-slate-500">Issues Reported</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{data.total}</p>

          <p className="mt-1 text-xs text-slate-400">Total civic reports</p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">Resolved</p>

          <p className="mt-2 text-3xl font-bold text-teal-700">
            {data.resolved}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Issues successfully resolved
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">In Progress</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {data.inProgress}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Currently being addressed
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">Open</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{data.open}</p>

          <p className="mt-1 text-xs text-slate-400">Awaiting action</p>
        </div>
      </div>

      <div className="card p-7">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Your Civic Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your issue reports over time.
          </p>
        </div>

        {activityEntries.length === 0 ? (
          <div className="mt-6 rounded-lg bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm text-slate-500">
              No contribution activity yet.
            </p>

            <Link
              to="/issues/create"
              className="btn btn-primary mt-4 inline-flex"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {new Date(activityEntries[0][0]).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </span>

              <span>
                {new Date(
                  activityEntries[activityEntries.length - 1][0],
                ).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {activityEntries.map(([date, count]) => (
                <div
                  key={date}
                  title={`${count} issue${
                    count === 1 ? "" : "s"
                  } on ${new Date(date).toLocaleDateString("en-IN")}`}
                  className={`h-6 w-6 rounded-md ${getActivityClass(count)}`}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 text-xs text-slate-400">
              <span>Less</span>

              <span className="h-4 w-4 rounded bg-slate-100" />
              <span className="h-4 w-4 rounded bg-teal-200" />
              <span className="h-4 w-4 rounded bg-teal-300" />
              <span className="h-4 w-4 rounded bg-teal-500" />
              <span className="h-4 w-4 rounded bg-teal-700" />

              <span>More</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <h2 className="text-lg font-semibold text-slate-900">
            Issues by Category
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Where your reports have made an impact.
          </p>

          {categoryEntries.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              No category data available.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {categoryEntries.map(([category, count]) => {
                const percentage =
                  data.total > 0 ? Math.round((count / data.total) * 100) : 0;

                return (
                  <div key={category}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {categoryLabels[category] || category}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {count}
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-7">
          <h2 className="text-lg font-semibold text-slate-900">Issue Status</h2>

          <p className="mt-1 text-sm text-slate-500">
            Current state of your reported issues.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Open</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {data.open}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">In Progress</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {data.inProgress}
              </p>
            </div>

            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-xs text-teal-700">Resolved</p>

              <p className="mt-1 text-2xl font-semibold text-teal-800">
                {data.resolved}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Rejected</p>

              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {data.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContributionsPage;
