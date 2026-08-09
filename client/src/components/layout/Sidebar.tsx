import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/issues">Issues</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
