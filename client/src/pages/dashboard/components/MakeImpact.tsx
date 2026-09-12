import { Link } from "react-router-dom";

function MakeImpact() {
  return (
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
            Report a civic issue with its location and supporting evidence. Your
            report can help turn an individual problem into useful community
            intelligence.
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
  );
}

export default MakeImpact;
