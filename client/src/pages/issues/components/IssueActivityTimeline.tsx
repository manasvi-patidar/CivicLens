import type { IssueActivity } from "../../../types/activity";

interface IssueActivityTimelineProps {
  activities: IssueActivity[];
}

function IssueActivityTimeline({ activities }: IssueActivityTimelineProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Activity
        </h2>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <div className="space-y-5">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />

                <div className="min-w-0">
                  <p className="text-sm text-slate-700">{activity.message}</p>

                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-400">
                    <span>{activity.user.name}</span>
                    <span>•</span>
                    <span>{new Date(activity.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueActivityTimeline;
