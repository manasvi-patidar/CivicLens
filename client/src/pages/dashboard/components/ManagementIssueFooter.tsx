import { Link } from "react-router-dom";

function ManagementIssueFooter() {
  return (
    <div className="border-t border-slate-100 px-6 py-4">
      <Link
        to="/issues"
        className="text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        View all issues →
      </Link>
    </div>
  );
}

export default ManagementIssueFooter;
