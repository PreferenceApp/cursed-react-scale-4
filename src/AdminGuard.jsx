import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext.jsx";

export function AdminGuard() {
  const { user} = useUser();

  // If there is no user, redirect them to the home page
  if (!user?.labels?.includes("admin"))
  {
    return <Navigate to="/" replace />;
  }

  // If a user exists, render the nested admin routes
  return <Outlet />;
}
