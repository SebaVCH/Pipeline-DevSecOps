import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';

// --- Simulación de dependencias ---

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

// Función auxiliar para renderizar el componente con el router
const renderComponent = () => {
    render(
        <MemoryRouter initialEntries={['/register']}>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<div>Página de Login</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Componente Register', () => {
    beforeEach(() => {
        // Espiamos la función fetch global
        vi.spyOn(global, 'fetch');
        mockNavigate.mockClear();
    });

    afterEach(() => {
        // Restauramos todos los mocks
        vi.restoreAllMocks();
    });

    it('debería renderizar el formulario de registro', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Elija un nombre de usuario')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Cree una contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Repita la contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });

    it('debería registrar un nuevo usuario y redirigir a /login', async () => {
        // Arrange: Simulamos una respuesta exitosa de la API
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as Response);

        renderComponent();

        // Act: Llenamos el formulario y lo enviamos
        fireEvent.change(screen.getByPlaceholderText('Elija un nombre de usuario'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByPlaceholderText('Cree una contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Repita la contraseña'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        // Assert: Verificamos la llamada a la API y la redirección
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/register', expect.any(Object));
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('debería mostrar un error si las contraseñas no coinciden', async () => {
        renderComponent();

        // Act
        fireEvent.change(screen.getByPlaceholderText('Elija un nombre de usuario'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Cree una contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Repita la contraseña'), { target: { value: 'password456' } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        // Assert
        expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
        expect(fetch).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('debería mostrar un error si el registro falla en el servidor', async () => {
        // Arrange: Simulamos una respuesta de error de la API
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'No se pudo registrar' }),
        } as Response);

        renderComponent();

        // Act
        fireEvent.change(screen.getByPlaceholderText('Elija un nombre de usuario'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Cree una contraseña'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Repita la contraseña'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

        // Assert
        expect(await screen.findByText('No se pudo registrar')).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('debería navegar a la página de login al hacer clic en el enlace', () => {
        renderComponent();

        // Act
        fireEvent.click(screen.getByText('Inicia sesión aquí'));

        // Assert
        expect(screen.getByText('Página de Login')).toBeInTheDocument();
    });
});