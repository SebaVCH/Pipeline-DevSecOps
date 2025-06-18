import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        body: JSON.stringify({ usuario, password }),
      })

      if (!res.ok) throw new Error('No se pudo registrar')

      // registro exitoso → redirigir al login
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
      <h2 style={{ textAlign: 'center' }}>Registro</h2>
      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuario"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <input
        type="password"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Confirmar contraseña"
        required
      />
      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </form>
  </div>
)

}

export default Register
