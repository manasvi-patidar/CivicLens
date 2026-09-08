interface IssueManagementFiltersProps {
  statusFilter: string;
  priorityFilter: string;
  categoryFilter: string;
  assignmentFilter: string;
  sortOrder: "newest" | "oldest";
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAssignmentChange: (value: string) => void;
  onSortChange: (value: "newest" | "oldest") => void;
}

function IssueManagementFilters({
  statusFilter,
  priorityFilter,
  categoryFilter,
  assignmentFilter,
  sortOrder,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onAssignmentChange,
  onSortChange,
}: IssueManagementFiltersProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="input"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Priority
        </label>

        <select
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          className="input"
        >
          <option value="">All priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Category
        </label>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="input"
        >
          <option value="">All categories</option>
          <option value="ROAD">Road</option>
          <option value="WATER">Water</option>
          <option value="ELECTRICITY">Electricity</option>
          <option value="GARBAGE">Garbage</option>
          <option value="STREETLIGHT">Streetlight</option>
          <option value="DRAINAGE">Drainage</option>
          <option value="PUBLIC_PROPERTY">Public Property</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Assignment
        </label>

        <select
          value={assignmentFilter}
          onChange={(event) => onAssignmentChange(event.target.value)}
          className="input"
        >
          <option value="">All issues</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="UNASSIGNED">Unassigned</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Sort
        </label>

        <select
          value={sortOrder}
          onChange={(event) =>
            onSortChange(event.target.value as "newest" | "oldest")
          }
          className="input"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  );
}

export default IssueManagementFilters;
