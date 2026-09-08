import { Link } from "react-router-dom";

function VolunteerWorkflow() {
  return (
    <div className="card overflow-hidden">
      <div className="p-7">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Volunteer workflow
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Work on assigned civic issues
          </h2>

          <p className="text-muted mt-2 leading-7">
            Open an assigned issue to review its description, location,
            evidence, comments, and activity history. Use the available actions
            for your role to contribute useful information.
          </p>

          <div className="mt-6">
            <Link to="/issues" className="btn btn-primary">
              Browse Issues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerWorkflow;
