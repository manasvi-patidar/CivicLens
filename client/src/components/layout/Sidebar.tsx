import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/issues"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Issues
        </NavLink>

        <NavLink
          to="/contributions"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Contributions
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
