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

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const entries: [string, number][] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day,
      ).padStart(2, "0")}`;

      entries.push([date, data.dailyActivity[date] || 0]);
    }

    return entries;
  }, [data]);

  const calendarStartDay = useMemo(() => {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  }, []);

  const currentMonthLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }, []);

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
            Your reports, comments and civic activities over time.
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {currentMonthLabel}
            </p>

            <p className="text-xs text-slate-400">
              {activityEntries.reduce((total, [, count]) => total + count, 0)}{" "}
              activities this month
            </p>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-slate-400"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: calendarStartDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-8 w-full" />
            ))}

            {activityEntries.map(([date, count]) => (
              <div
                key={date}
                title={`${count} activity${
                  count === 1 ? "" : "ies"
                } on ${new Date(`${date}T00:00:00`).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}`}
                className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition-transform hover:scale-105 ${getActivityClass(
                  count,
                )} ${count > 0 ? "text-slate-700" : "text-slate-400"}`}
              >
                {Number(date.split("-")[2])}
              </div>
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
