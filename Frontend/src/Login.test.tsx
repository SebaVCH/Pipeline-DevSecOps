import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';

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

// Creamos tokens falsos para las pruebas.
const adminToken = `header.${btoa(JSON.stringify({ user_role: 'admin' }))}.signature`;
const userToken = `header.${btoa(JSON.stringify({ user_role: 'user' }))}.signature`;

// Función auxiliar para renderizar el componente con el router
const renderComponent = () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<div>Página del Dashboard</div>} />
                <Route path="/admin" element={<div>Página de Admin</div>} />
                <Route path="/register" element={<div>Página de Registro</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Componente Login', () => {
    beforeEach(() => {
        // Espiamos la función fetch global y localStorage
        vi.spyOn(global, 'fetch');
        vi.spyOn(Storage.prototype, 'setItem');
        localStorage.clear();
    });

    afterEach(() => {
        // Restauramos todos los mocks
        vi.restoreAllMocks();
    });

    it('debería renderizar el formulario de inicio de sesión', () => {
        renderComponent();
        expect(screen.getByPlaceholderText('Ingrese su nombre de usuario')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingrese su contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    });

    it('debería iniciar sesión y redirigir a /dashboard para un usuario normal', async () => {
        // Arrange: Simulamos una respuesta exitosa de la API con un token de usuario
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ message: userToken }),
        } as Response);

        renderComponent();

        // Act: Llenamos el formulario y lo enviamos
        fireEvent.change(screen.getByPlaceholderText('Ingrese su nombre de usuario'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

        // Assert: Verificamos la llamada a la API, el guardado del token y la redirección
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
            expect(localStorage.setItem).toHaveBeenCalledWith('token', userToken);
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('debería iniciar sesión y redirigir a /admin para un administrador', async () => {
        // Arrange: Simulamos una respuesta exitosa con un token de admin
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ message: adminToken }),
        } as Response);

        renderComponent();

        // Act
        fireEvent.change(screen.getByPlaceholderText('Ingrese su nombre de usuario'), { target: { value: 'adminuser' } });
        fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), { target: { value: 'adminpass' } });
        fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

        // Assert
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin');
        });
    });

    it('debería mostrar un mensaje de error si las credenciales son incorrectas', async () => {
        // Arrange: Simulamos una respuesta de error de la API
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Credenciales inválidas' }),
        } as Response);

        renderComponent();

        // Act
        fireEvent.change(screen.getByPlaceholderText('Ingrese su nombre de usuario'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

        // Assert: Verificamos que se muestra el mensaje de error
        expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('debería navegar a la página de registro al hacer clic en el enlace', () => {
        renderComponent();

        // Act: Hacemos clic en el enlace de registro
        fireEvent.click(screen.getByText('Regístrate aquí'));

        // Assert: Verificamos que se navega a la página de registro
        expect(screen.getByText('Página de Registro')).toBeInTheDocument();
    });
});