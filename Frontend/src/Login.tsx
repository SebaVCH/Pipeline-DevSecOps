import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password }),
      })

      const data = await res.json()
      console.log('Respuesta del backend:', data)

      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')

      // Guarda el token y el rol
      localStorage.setItem('token', data.message)
      localStorage.setItem('role', data.role)

      // Redirige según el rol
      if (data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '210vh',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <input
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <p style={{ textAlign: 'center' }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </form>
    </div>
  )
}

export default Login
