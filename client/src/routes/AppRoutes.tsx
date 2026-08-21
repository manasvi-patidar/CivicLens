import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "../pages/dashboard/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route
            path="/issues"
            element={
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-teal-700">Issues</h2>
              </div>
            }
          />

          <Route
            path="/profile"
            element={
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-teal-700">
                  Profile
                </h2>
              </div>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
