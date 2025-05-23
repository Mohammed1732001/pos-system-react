
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // لو فيه توكن يعني مسجل دخول

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute;
