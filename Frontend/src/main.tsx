import { StrictMode, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Login from './Login'
import './index.css'
import Register from './Register'
import Dashboard from './Dashboard'; // Tu componente de dashboard
import Menu from './Menu';
import AdminPanel from './AdminPanel';

interface TokenPayload {
  user_role?: string;
  user_id?: number;
  exp?: number;
  [key: string]: unknown;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta protegida para el dashboard */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

        {/* Ruta protegida para el panel de administración */}
        <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
        </Routes>

    </BrowserRouter>
  </StrictMode>
)

// Componente que protege la ruta principal
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}
function RequireAdmin({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const tokenData = jwtDecode<TokenPayload>(token);
    const isAdmin = tokenData.user_role === 'admin';

    if (!isAdmin) return <Navigate to="/dashboard" replace />;

    return children;
  } catch (error) {
    console.error("Error al verificar rol de administrador:", error);
    return <Navigate to="/dashboard" replace />;
  }
}
