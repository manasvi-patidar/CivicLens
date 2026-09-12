function GettingStarted() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">Getting started</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <span className="text-sm font-semibold text-teal-700">01</span>

          <h3 className="mt-2 font-semibold text-slate-900">Report an issue</h3>

          <p className="text-muted mt-1 text-sm leading-6">
            Share a civic problem with a clear description and location.
          </p>
        </div>

        <div className="card p-5">
          <span className="text-sm font-semibold text-teal-700">02</span>

          <h3 className="mt-2 font-semibold text-slate-900">Track progress</h3>

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
  );
}

export default GettingStarted;
