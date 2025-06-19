// src/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from './api';
import './Dashboard.css';

interface Nota {
  id: number;
  titulo: string;
  contenido: string;
}

function Dashboard() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      cargarNotas();
    }
  }, [navigate, token]);

  const cargarNotas = async () => {
    try {
      const data = await apiFetch('/mental-notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Adaptar los datos del backend al formato esperado por el frontend
      const notasAdaptadas: Nota[] = data.map((nota: any) => ({
        id: nota.ID,
        titulo: nota.Title,
        contenido: nota.Description,
      }));

      setNotas(notasAdaptadas);
    } catch (error) {
      console.error('Error al cargar las notas:', error);
      navigate('/login');
    }
  };

  const crearNota = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      return;
    }

    try {
      await apiFetch('/mental-notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: titulo,
          Description: contenido,
        }),
      });

      setTitulo('');
      setContenido('');
      cargarNotas();
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard de Notas hola</h1>
        <button onClick={logout} className="logout-button">Cerrar sesión</button>
      </div>

      <div className="form-container">
        <h2>Crear Nueva Nota</h2>
        <form onSubmit={crearNota}>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
            required
          />
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Contenido..."
            rows={4}
            required
          />
          <button type="submit">Guardar Nota</button>
        </form>
      </div>

      <div className="notes-container">
        <h2>Tus Notas</h2>
        {notas.length > 0 ? (
          <ul className="notes-grid">
            {notas.map((nota) => (
              <li key={nota.id} className="note-card">
                <h3>{nota.titulo}</h3>
                <p>{nota.contenido}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No tienes notas aún. ¡Agrega una!
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
