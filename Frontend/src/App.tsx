import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from './api'

interface Nota {
  id: number
  titulo: string
  contenido: string
}

function App() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const navigate = useNavigate()

  const cargarNotas = async () => {
    try {
      const data = await apiFetch('/mental-notes')
      setNotas(data)
    } catch {
      navigate('/login')
    }
  }

  const crearNota = async (e: React.FormEvent) => {
    e.preventDefault()
    await apiFetch('/mental-notes', {
      method: 'POST',
      body: JSON.stringify({ titulo, contenido }),
    })
    setTitulo('')
    setContenido('')
    cargarNotas()
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    cargarNotas()
  }, [])

  return (
    <div>
      <h1>Mis Notas</h1>
      <button onClick={logout}>Cerrar sesión</button>
      <form onSubmit={crearNota}>
        <input
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Título"
          required
        />
        <textarea
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          placeholder="Contenido"
          required
        />
        <button type="submit">Guardar Nota</button>
      </form>

      <ul>
        {notas.map((n) => (
          <li key={n.id}>
            <h3>{n.titulo}</h3>
            <p>{n.contenido}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
