import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import { apiFetch } from './api';

// Hacemos un mock del módulo apiFetch para controlar las llamadas a la API
vi.mock('./api', () => ({
    apiFetch: vi.fn(),
}));

describe('AdminPanel', () => {
    // Antes de cada prueba, simulamos que hay un token de admin en localStorage
    beforeEach(() => {
        localStorage.setItem('token', 'dummy-admin-token');
        // Limpiamos los mocks para que cada prueba sea independiente
        vi.mocked(apiFetch).mockClear();
    });

    // Después de cada prueba, limpiamos el localStorage
    afterEach(() => {
        localStorage.removeItem('token');
    });

    const renderComponent = () => {
        render(
            <MemoryRouter>
                <AdminPanel />
            </MemoryRouter>
        );
    };

    it('debería renderizar los títulos y las tablas vacías inicialmente', () => {
        // Configuramos el mock para que devuelva datos vacíos y no falle
        vi.mocked(apiFetch).mockResolvedValue({ message: [] });
        renderComponent();

        expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /usuarios/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /todas las notas/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
    });

    it('debería cargar y mostrar la lista de usuarios y notas', async () => {
        // 1. Simulamos las respuestas de la API para usuarios y notas
        vi.mocked(apiFetch)
            .mockResolvedValueOnce({ // Para /admin/users
                message: [
                    { ID: 1, Username: 'admin', Role: 'admin' },
                    { ID: 2, Username: 'testuser', Role: 'user' },
                ]
            })
            .mockResolvedValueOnce([ // Para /admin/mental-notes
                { ID: 1, Title: 'Nota importante', Description: 'Contenido de la nota.', Author: { ID: 2, Username: 'testuser', Role: 'user' } },
                { ID: 2, Title: 'Otra nota', Description: 'Más contenido.', Author: { ID: 1, Username: 'admin', Role: 'admin' } },
            ]);

        // 2. Renderizamos el componente
        renderComponent();

        // 3. Verificamos que los datos se muestren correctamente
        // Esperamos a que aparezcan todas las instancias de 'admin'
        const adminElements = await screen.findAllByText('admin');
        // Debería haber 3: como nombre de usuario, como rol y como autor de una nota.
        expect(adminElements).toHaveLength(3);

        // Verificamos 'testuser' usando findAllByText
        const testuserElements = await screen.findAllByText('testuser');
        // Debería haber 2: como nombre de usuario y como autor de una nota.
        expect(testuserElements).toHaveLength(2);

        // Verificamos que los títulos de las notas también se hayan cargado
        expect(await screen.findByText('Nota importante')).toBeInTheDocument();
        expect(await screen.findByText('Otra nota')).toBeInTheDocument();
    });

    it('debería manejar errores al cargar datos', async () => {
        // Simulamos un error en la API
        vi.mocked(apiFetch).mockRejectedValue(new Error('Error de red'));

        renderComponent();

        // Esperamos a que el componente se estabilice
        await waitFor(() => {
            // El panel principal debe seguir visible
            expect(screen.getByRole('heading', { name: /panel de administración/i })).toBeInTheDocument();
        });

        // Verificamos que no se renderizó ningún dato de usuario o nota
        expect(screen.queryByText('admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Nota importante')).not.toBeInTheDocument();
    });
});