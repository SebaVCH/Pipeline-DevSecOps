// src/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Asumo que apiFetch está definido en './api' y maneja las llamadas fetch con el token.
import { apiFetch } from './api';

// Definición de la interfaz para una Nota, movida aquí para auto-contención
interface Nota {
  id: number;
  titulo: string;
  contenido: string;
}

/**
 * Componente del Dashboard.
 * Muestra un apartado para listar notas existentes y un formulario para crear nuevas notas.
 * Incluye un botón para cerrar sesión.
 */
function Dashboard() {
  // Estados para manejar las notas, el título y contenido del formulario
  const [notas, setNotas] = useState<Nota[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const navigate = useNavigate(); // Hook para la navegación programática

  // Obtiene el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');

  // useEffect para cargar las notas cuando el componente se monta
  // o cuando el token/navigate cambian.
  useEffect(() => {
    // Si no hay token, redirige al login
    if (!token) {
      navigate('/login');
    } else {
      cargarNotas(); // Si hay token, carga las notas
    }
  }, [navigate, token]); // Dependencias: navigate (para la redirección) y token (para recargar si cambia)

  /**
   * Función asíncrona para cargar las notas del usuario desde la API.
   * Redirige a /login en caso de error o token inválido.
   */
  const cargarNotas = async () => {
    try {
      // Realiza la petición GET a /mental-notes con el token de autorización
      const data = await apiFetch('/mental-notes', {
        headers: {
          'Authorization': `Bearer ${token}`, // Incluye el token en los headers
        },
      });
      setNotas(data); // Actualiza el estado con las notas obtenidas
    } catch (error) {
      console.error('Error al cargar las notas:', error);
      // En caso de error (ej. token expirado/inválido), redirige al login
      navigate('/login');
    }
  };

  /**
   * Función asíncrona para crear una nueva nota.
   * Se ejecuta al enviar el formulario.
   * @param e Evento del formulario.
   */
  const crearNota = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Valida que título y contenido no estén vacíos
    if (!titulo.trim() || !contenido.trim()) {
      // Podrías mostrar un mensaje de error al usuario aquí
      return;
    }

    try {
      // Realiza la petición POST a /mental-notes para crear una nueva nota
      await apiFetch('/mental-notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Indica que el cuerpo es JSON
        },
        body: JSON.stringify({ titulo, contenido }), // Envía el título y contenido de la nota
      });

      // Limpia los campos del formulario después de crear la nota
      setTitulo('');
      setContenido('');
      cargarNotas(); // Vuelve a cargar las notas para mostrar la nueva
    } catch (error) {
      console.error('Error al crear la nota:', error);
      // Aquí podrías manejar el error, quizás mostrando un mensaje al usuario
    }
  };

  /**
   * Función para cerrar la sesión del usuario.
   * Elimina el token y redirige al login.
   */
  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token de localStorage
    navigate('/login'); // Redirige al login
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans flex flex-col items-center">
      {/* Encabezado y botón de cerrar sesión */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Tu Dashboard de Notas</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Sección para crear nueva nota */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl mb-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Crear Nueva Nota</h2>
        <form onSubmit={crearNota} className="flex flex-col gap-4">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la nota"
            required
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Contenido de la nota..."
            required
            rows={5} // Altura inicial del textarea
            className="p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Guardar Nota
          </button>
        </form>
      </div>

      {/* Sección para listar notas existentes */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Tus Notas</h2>
        {notas.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notas.map((nota) => (
              <li key={nota.id} className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200 flex flex-col">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{nota.titulo}</h3>
                <p className="text-gray-700 text-base flex-grow">{nota.contenido}</p>
                {/* Puedes añadir botones para editar/eliminar aquí */}
                {/* <div className="mt-3 flex justify-end gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                    <button className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
                </div> */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 text-lg">No tienes notas aún. ¡Crea una!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
