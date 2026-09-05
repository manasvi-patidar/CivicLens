import type { Issue, IssueStatus } from "../../../types/issue";

interface AssignableUser {
  id: string;
  name: string;
  email: string;
  role: "VOLUNTEER" | "AUTHORITY";
}

interface IssueInfoProps {
  issue: Issue;
  canUpdateStatus: boolean;
  updatingStatus: boolean;
  statusUpdateError: string;
  onStatusChange: (status: IssueStatus) => void;
  canAssignIssue: boolean;
  assignableUsers: AssignableUser[];
  assigningIssue: boolean;
  assignmentError: string;
  onAssignIssue: (userId: string) => void;
}

function IssueInfo({
  issue,
  canUpdateStatus,
  updatingStatus,
  statusUpdateError,
  onStatusChange,
  canAssignIssue,
  assignableUsers,
  assigningIssue,
  assignmentError,
  onAssignIssue,
}: IssueInfoProps) {
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

          {canUpdateStatus ? (
            <div className="flex items-center">
              <label htmlFor="issue-status" className="sr-only">
                Issue status
              </label>

              <select
                id="issue-status"
                value={issue.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as IssueStatus)
                }
                disabled={updatingStatus}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          ) : (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {issue.status}
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {issue.priority}
          </span>
        </div>

        {statusUpdateError && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {statusUpdateError}
          </p>
        )}

        {canAssignIssue && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <label
              htmlFor="issue-assignee"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Assign issue
            </label>

            <select
              id="issue-assignee"
              value={issue.assignedTo?.id ?? ""}
              onChange={(event) => onAssignIssue(event.target.value)}
              disabled={assigningIssue}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select a volunteer or authority</option>

              {assignableUsers.map((assignableUser) => (
                <option key={assignableUser.id} value={assignableUser.id}>
                  {assignableUser.name} ({assignableUser.role})
                </option>
              ))}
            </select>

            {assignmentError && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {assignmentError}
              </p>
            )}

            {assigningIssue && (
              <p className="mt-2 text-xs text-slate-500">Assigning issue...</p>
            )}
          </div>
        )}

        {issue.assignedTo && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assigned to
            </h2>

            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-700">
                {issue.assignedTo.name}
              </p>

              {issue.assignedTo.email && (
                <p className="mt-1 text-sm text-slate-500">
                  {issue.assignedTo.email}
                </p>
              )}

              {issue.assignedTo.role && (
                <span className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {issue.assignedTo.role}
                </span>
              )}
            </div>
          </div>
        )}

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
