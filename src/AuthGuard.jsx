import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./context/UserContext.jsx";

export default function AuthGuard() {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}