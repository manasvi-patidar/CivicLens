import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <Link to="/" className="shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-teal-700">
          CivicLens
        </h1>

        <p className="text-[11px] font-medium text-slate-500">
          Open Civic Intelligence Platform
        </p>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-700">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">{user.role}</p>
            </div>

            <Link to="/profile" className="btn btn-secondary">
              Profile
            </Link>

            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-teal-700"
            >
              Sign in
            </Link>

            <Link to="/register" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
