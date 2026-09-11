interface CitizenDashboardErrorProps {
  error: string;
}

function CitizenDashboardError({ error }: CitizenDashboardErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </div>
  );
}

export default CitizenDashboardError;
