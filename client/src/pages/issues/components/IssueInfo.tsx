import type { Issue } from "../../../types/issue";

interface IssueInfoProps {
  issue: Issue;
}

function IssueInfo({ issue }: IssueInfoProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {issue.imageUrl && (
        <div className="border-b border-slate-200 bg-slate-50 p-4">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="max-h-[420px] w-full rounded-lg object-contain"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {issue.category}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {issue.status}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {issue.priority}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Description
          </h2>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {issue.description}
          </p>
        </div>

        {issue.address && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Location
            </h2>

            <p className="mt-2 text-sm text-slate-700">{issue.address}</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Latitude
            </p>

            <p className="mt-1 text-sm text-slate-700">{issue.latitude}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Longitude
            </p>

            <p className="mt-1 text-sm text-slate-700">{issue.longitude}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueInfo;
