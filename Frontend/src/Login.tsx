import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  user_role?: string;
  user_id?: number;
  exp?: number;
  [key: string]: unknown;
}

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

      const token = data.message || data.token
      localStorage.setItem('token', token)

      try {
        const tokenData = jwtDecode<TokenPayload>(token)
        console.log("Token decodificado:", tokenData)

        if (tokenData && tokenData.user_role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } catch (decodeError) {
        console.error("Error al decodificar el token:", decodeError)
        navigate('/dashboard')
      }
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message)
    }
  }

  return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '420px'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: 'white',
              margin: '0',
              fontWeight: '600',
              fontSize: '1.75rem'
            }}>Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} style={{
            padding: '2rem'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#495057'
              }}>Usuario</label>
              <input
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  style={{
                    width: '94%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  placeholder="Ingrese su nombre de usuario"
                  required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#495057'
              }}>Contraseña</label>
              <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '94%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  placeholder="Ingrese su contraseña"
                  required
              />
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease-in-out',
              marginBottom: '1rem'
            }}>Ingresar</button>

            {error && <p style={{
              color: '#dc3545',
              textAlign: 'center',
              margin: '1rem 0',
              padding: '0.5rem',
              backgroundColor: '#f8d7da',
              borderRadius: '4px'
            }}>{error}</p>}

            <p style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              ¿No tienes cuenta? <Link to="/register" style={{
              color: '#007bff',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Regístrate aquí</Link>
            </p>
          </form>
        </div>
      </div>
  )
}

export default Login