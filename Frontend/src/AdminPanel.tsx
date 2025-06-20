import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from './api';

interface Usuario {
  ID: number;
  Username: string;
  Role: string;
}

interface Nota {
  ID: number;
  Title: string;
  Description: string;
  Author: Usuario;
}

function AdminPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    cargarUsuarios();
    cargarNotas();
  }, [token, navigate]); // Added dependencies to useEffect

  const cargarUsuarios = async () => {
    try {
      const data = await apiFetch('/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(data.message || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuarios([])
    }
  };

  const cargarNotas = async () => {
    try {
      const data = await apiFetch('/admin/mental-notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotas(data);
    } catch (err) {
      console.error('Error al cargar notas:', err);
    }
  };

  return (
    <div style={{
        padding: '2rem',
        backgroundColor: '#f8f9fa', // Light background for the whole panel
        color: '#212529', // Dark text for contrast
        fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h1>Panel de Administración</h1>
        <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
        >
          Cerrar sesión
        </button>
      </div>

      <h2>Usuarios</h2>
      <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1rem 0',
          backgroundColor: '#ffffff', // White background for the table
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' // Subtle shadow
      }}>
        <thead style={{
            backgroundColor: '#e9ecef', // Light grey header background
            color: '#495057' // Slightly darker text for headers
        }}>
          <tr>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>ID</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Username</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.ID} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '0.75rem' }}>{u.ID}</td>
              <td style={{ padding: '0.75rem' }}>{u.Username}</td>
              <td style={{ padding: '0.75rem' }}>{u.Role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Todas las Notas</h2>
      <ul style={{
          listStyleType: 'none', // Remove default bullet points
          padding: '0',
          margin: '1rem 0'
      }}>
        {notas.map((nota) => (
          <li key={nota.ID} style={{
              backgroundColor: '#ffffff', // White background for each note item
              padding: '1rem',
              marginBottom: '0.5rem',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', // Lighter shadow for notes
              borderLeft: '5px solid #007bff' // A blue left border for emphasis
          }}>
            <strong style={{ color: '#0056b3' }}>{nota.Title || '[Sin título]'}</strong> por <em style={{ color: '#6c757d' }}>{nota.Author?.Username}</em>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>{nota.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;