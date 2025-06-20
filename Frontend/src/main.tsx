import { StrictMode, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './Login'
import './index.css'
import Register from './Register'
import Dashboard from './Dashboard'; // Tu componente de dashboard
import RedCirclePage from './RedCirclePage'; // Tu nuevo componente de círculo rojo
import AdminPanel from './AdminPanel';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedCirclePage />} />
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
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (role == 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
