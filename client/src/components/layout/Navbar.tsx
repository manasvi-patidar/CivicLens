import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-teal-700">
          CivicLens
        </h1>

        <p className="text-[11px] font-medium text-slate-500">
          Open Civic Intelligence Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-700">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">{user.role}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
