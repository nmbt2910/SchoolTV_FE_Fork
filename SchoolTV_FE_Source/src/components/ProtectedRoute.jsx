import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

// Bảo vệ route theo vai trò người dùng
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, checkRole } = useUser();

  console.log('User:', user);
  console.log('Allowed roles:', allowedRoles);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isAllowed = allowedRoles.some(role => checkRole(role));
  console.log('Is Allowed:', isAllowed);

  if (!isAllowed) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
