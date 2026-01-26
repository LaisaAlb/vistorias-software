import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login/login"
import InspectionsList from "../pages/Inspections/InspectionsList"
import { AppLayout } from "../layout/appLayout"
import Dashboard from "../pages/Dashboard/dashboard"
import ReasonsForRejection from "../pages/ReasonsForRejection/reasonsForRejection"
import ProtectedRoute from "./ProtectedRoute"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inspections" element={<InspectionsList />} />

        <Route
          path="/reasonsRejects"
          element={
            <ProtectedRoute roles={['INSPECTOR']}>
              <ReasonsForRejection />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
