import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_REDIRECTS = {
  P: "/PatientDashboard",
  D: "/DoctorDashboard",
  A: "/AdminDashboard",
};


const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a3a] to-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Verifying user info...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const correctPath = ROLE_REDIRECTS[user.role] ?? "/";
    return <Navigate to={correctPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
