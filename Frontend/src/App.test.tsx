import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { apiFetch } from './api';

// --- Simulación de dependencias ---

// Mock de la función apiFetch para controlar las respuestas de la API
vi.mock('./api');

// Mock del hook useNavigate para espiar las llamadas de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// --- Configuración de las pruebas ---

const mockNotes = [
    { id: 1, titulo: 'Primera Nota', contenido: 'Contenido de la primera nota' },
    { id: 2, titulo: 'Segunda Nota', contenido: 'Contenido de la segunda nota' },
];

// Función auxiliar para renderizar el componente con el router
const renderComponent = () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
};

describe('Componente App', () => {
    beforeEach(() => {
        // Limpiamos los mocks antes de cada prueba
        vi.mocked(apiFetch).mockClear();
        mockNavigate.mockClear();
    });

    afterEach(() => {
        // Restauramos todos los mocks
        vi.restoreAllMocks();
    });

    it('debería cargar y mostrar las notas al renderizar', async () => {
        // Arrange: Simulamos una respuesta exitosa de la API
        vi.mocked(apiFetch).mockResolvedValue(mockNotes);

        // Act: Renderizamos el componente
        renderComponent();

        // Assert: Verificamos que se llamó a la API y se renderizaron las notas
        expect(apiFetch).toHaveBeenCalledWith('/mental-notes');
        expect(await screen.findByText('Primera Nota')).toBeInTheDocument();
        expect(await screen.findByText('Contenido de la segunda nota')).toBeInTheDocument();
    });

    it('debería redirigir a /login si la carga de notas falla', async () => {
        // Arrange: Simulamos un error en la llamada a la API
        vi.mocked(apiFetch).mockRejectedValue(new Error('API Error'));

        // Act: Renderizamos el componente
        renderComponent();

        // Assert: Verificamos que se llamó a la función de navegación hacia /login
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('debería permitir crear una nueva nota y mostrarla en la lista', async () => {
        // Arrange: Configuramos las respuestas de la API para la carga inicial y la creación
        const newNote = { id: 3, titulo: 'Nota Nueva', contenido: 'Contenido fresco' };
        vi.mocked(apiFetch)
            .mockResolvedValueOnce(mockNotes) // Carga inicial
            .mockResolvedValueOnce({}) // Respuesta del POST al crear
            .mockResolvedValueOnce([...mockNotes, newNote]); // Carga después de crear

        renderComponent();

        // Act: Llenamos el formulario y lo enviamos
        fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Nota Nueva' } });
        fireEvent.change(screen.getByPlaceholderText('Contenido'), { target: { value: 'Contenido fresco' } });
        fireEvent.click(screen.getByRole('button', { name: /guardar nota/i }));

        // Assert: Verificamos que la nueva nota se muestra
        expect(await screen.findByText('Nota Nueva')).toBeInTheDocument();
        expect(apiFetch).toHaveBeenCalledWith('/mental-notes', {
            method: 'POST',
            body: JSON.stringify({ titulo: 'Nota Nueva', contenido: 'Contenido fresco' }),
        });
        // Se debe llamar a la API 3 veces: carga inicial, POST, y recarga
        expect(apiFetch).toHaveBeenCalledTimes(3);
    });

    it('debería cerrar sesión y redirigir a /login al hacer clic en el botón', async () => {
        // Arrange: Simulamos la carga inicial de notas
        vi.mocked(apiFetch).mockResolvedValue(mockNotes);
        localStorage.setItem('token', 'dummy-token'); // Simulamos que hay una sesión activa

        renderComponent();

        // Esperamos a que el componente se cargue
        await screen.findByText('Mis Notas');

        // Act: Hacemos clic en el botón de cerrar sesión
        fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));

        // Assert: Verificamos que el token se eliminó y se redirigió
        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});