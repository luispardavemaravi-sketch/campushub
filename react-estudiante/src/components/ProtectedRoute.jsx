import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { autenticado } = useAuth();
  const ubicacion = useLocation();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: ubicacion.pathname }}
      />
    );
  }

  return <Outlet />;
}