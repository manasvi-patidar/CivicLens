import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/auth/LoginPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <div className="card max-w-md p-8">
              <h2 className="text-2xl font-semibold text-teal-700">
                CivicLens
              </h2>

              <p className="text-muted mt-2">
                Open Civic Intelligence Platform
              </p>

              <button className="btn btn-primary mt-6">
                Test CivicLens UI
              </button>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
