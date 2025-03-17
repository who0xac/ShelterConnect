import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import roles from "../context/role.js"; 
import { jwtDecode } from "jwt-decode"; 

const ProtectedRoute = ({ requiredRole, children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!requiredRole) {
    return children ? children : <Outlet />;
  }

  const token = localStorage.getItem("token");
  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/" replace />;
  }

  const userRole = decodedToken.role;

  if (roles[userRole]?.includes(requiredRole)) {
      return children ? children : <Outlet />;
  }
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;

