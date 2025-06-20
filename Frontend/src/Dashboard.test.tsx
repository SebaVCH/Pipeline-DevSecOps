import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { apiFetch } from './api';

// --- Simulación de dependencias ---

// Mock de apiFetch para controlar las respuestas de la API
vi.mock('./api');

// Mock de useNavigate para espiar las llamadas de navegación
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// --- Configuración de las pruebas ---

// Datos simulados de la API
const mockApiNotes = [
    { ID: 1, Title: 'Nota de Prueba 1', Description: 'Contenido de prueba 1' },
    { ID: 2, Title: 'Nota de Prueba 2', Description: 'Contenido de prueba 2' },
];

// Función auxiliar para renderizar el componente
const renderComponent = () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );
};

describe('Componente Dashboard', () => {
    beforeEach(() => {
        // Establecemos un token antes de cada prueba que requiera autenticación
        localStorage.setItem('token', 'test-token');
        // Limpiamos los mocks antes de cada prueba
        vi.mocked(apiFetch).mockClear();
        mockNavigate.mockClear();
    });

    afterEach(() => {
        // Limpiamos localStorage y restauramos los mocks
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('debería redirigir a /login si no hay token', () => {
        localStorage.removeItem('token');
        renderComponent();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('debería cargar y mostrar las notas correctamente', async () => {
        vi.mocked(apiFetch).mockResolvedValue(mockApiNotes);
        renderComponent();

        // Verificamos que se llamó a la API y se renderizaron las notas
        expect(apiFetch).toHaveBeenCalledWith('/mental-notes', expect.any(Object));
        expect(await screen.findByText('Nota de Prueba 1')).toBeInTheDocument();
        expect(await screen.findByText('Contenido de prueba 2')).toBeInTheDocument();
    });

    it('debería redirigir a /login si la carga de notas falla', async () => {
        vi.mocked(apiFetch).mockRejectedValue(new Error('API Error'));
        renderComponent();

        // Esperamos a que se ejecute la lógica de error y se llame a navigate
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('debería permitir crear una nueva nota', async () => {
        const newNote = { ID: 3, Title: 'Nueva Nota Creada', Description: 'Contenido nuevo' };
        vi.mocked(apiFetch)
            .mockResolvedValueOnce(mockApiNotes) // Carga inicial
            .mockResolvedValueOnce({}) // Respuesta del POST
            .mockResolvedValueOnce([...mockApiNotes, newNote]); // Recarga tras crear

        renderComponent();
        await screen.findByText('Nota de Prueba 1'); // Esperar carga inicial

        // Simulamos la creación de la nota
        fireEvent.change(screen.getByPlaceholderText('Título'), { target: { value: 'Nueva Nota Creada' } });
        fireEvent.change(screen.getByPlaceholderText('Contenido...'), { target: { value: 'Contenido nuevo' } });
        fireEvent.click(screen.getByRole('button', { name: /guardar nota/i }));

        // Verificamos que la nueva nota aparece y el formulario se limpia
        expect(await screen.findByText('Nueva Nota Creada')).toBeInTheDocument();
        expect(apiFetch).toHaveBeenCalledWith('/mental-notes', expect.objectContaining({ method: 'POST' }));
        expect(screen.getByPlaceholderText('Título')).toHaveValue('');
    });

    it('debería permitir eliminar una nota', async () => {
        vi.mocked(apiFetch)
            .mockResolvedValueOnce(mockApiNotes) // Carga inicial
            .mockResolvedValueOnce({}) // Respuesta del DELETE
            .mockResolvedValueOnce([mockApiNotes[1]]); // Recarga con la nota eliminada

        renderComponent();

        // Buscamos TODOS los botones de eliminar y nos quedamos con el primero
        const deleteButtons = await screen.findAllByRole('button', { name: /eliminar/i });
        fireEvent.click(deleteButtons[0]); // Hacemos clic en el botón de la primera nota

        // Verificamos que la nota fue eliminada de la UI
        await waitFor(() => {
            expect(screen.queryByText('Nota de Prueba 1')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Nota de Prueba 2')).toBeInTheDocument();
        expect(apiFetch).toHaveBeenCalledWith('/mental-notes/1', expect.objectContaining({ method: 'DELETE' }));
    });

    it('debería cerrar sesión y redirigir a /login', async () => {
        vi.mocked(apiFetch).mockResolvedValue([]);
        renderComponent();
        await screen.findByText('Dashboard de Notas haaaaola');

        const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
        fireEvent.click(logoutButton);

        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});