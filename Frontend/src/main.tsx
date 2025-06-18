import { StrictMode, type JSX } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './Login'
import './index.css'
import Register from './Register'
import Dashboard from './Dashboard'; // Tu componente de dashboard
import RedCirclePage from './RedCirclePage'; // Tu nuevo componente de círculo rojo


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedCirclePage />} />

        {/* Ruta para la página de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<Register />} />

        {/*
          Ruta para el dashboard.
          Podrías envolverla en RequireAuth si quieres que solo usuarios logueados accedan.
          Ejemplo: <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

// Componente que protege la ruta principal
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}
