import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="app-layout">
      <header>
        <h1>CivicLens</h1>
        <p>Open Civic Intelligence Platform</p>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
