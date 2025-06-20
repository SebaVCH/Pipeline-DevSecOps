import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const res = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usuario,
          password,
          role: rol,
        }),
      })

      if (!res.ok) throw new Error('No se pudo registrar')

      navigate('/login')
    } catch (err: any) {
      setError(err.message)
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
            backgroundColor: '#28a745',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: 'white',
              margin: '0',
              fontWeight: '600',
              fontSize: '1.75rem'
            }}>Registro de Usuario</h2>
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
                  onChange={(e) => setUsuario(e.target.value)}
                  style={{
                    width: '94%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  placeholder="Elija un nombre de usuario"
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
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '94%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  placeholder="Cree una contraseña"
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
              }}>Confirmar Contraseña</label>
              <input
                  type="password"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  style={{
                    width: '94%',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    transition: 'border-color 0.15s ease-in-out'
                  }}
                  placeholder="Repita la contraseña"
                  required
              />
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease-in-out',
              marginBottom: '1rem'
            }}>Registrarse</button>

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
              ¿Ya tienes cuenta? <Link to="/login" style={{
              color: '#28a745',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </div>
  )
}

export default Register