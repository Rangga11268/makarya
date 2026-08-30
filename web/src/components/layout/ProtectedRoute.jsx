import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase() || "";
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  if (normalizedAllowed.length > 0) {
    const isAllowed = 
      normalizedAllowed.includes(userRole) ||
      (userRole === "MHS" && normalizedAllowed.includes("MAHASISWA")) ||
      (userRole === "MAHASISWA" && normalizedAllowed.includes("MHS"));

    if (!isAllowed) {
      if (userRole === "ADMIN") {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}