import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    // nu e admin → redirect la login
    return <Navigate to="/login" />;
  }

  return children;
}
