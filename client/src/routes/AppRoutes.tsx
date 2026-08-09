import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <div>
              <h2>CivicLens</h2>
              <p>Open Civic Intelligence Platform</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
