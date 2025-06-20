import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiFetch } from './api';

// Hacemos un mock de la función fetch global para no realizar llamadas reales
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('apiFetch', () => {

    // Limpiamos los mocks y el localStorage después de cada prueba para asegurar el aislamiento
    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('debería realizar una petición GET sin token de autorización', async () => {
        const mockData = { message: 'éxito' };
        // Simulamos una respuesta exitosa de fetch
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await apiFetch('/test-endpoint');

        // Verificamos que fetch fue llamado con la URL y cabeceras correctas
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/test-endpoint', {
            headers: { 'Content-Type': 'application/json' },
        });
        // Verificamos que el resultado es el esperado
        expect(data).toEqual(mockData);
    });

    it('debería incluir el token de autorización si está en localStorage', async () => {
        const token = 'dummy-jwt-token';
        localStorage.setItem('token', token);

        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        });

        await apiFetch('/secure-endpoint');

        // Verificamos que fetch fue llamado con la cabecera de autorización
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/secure-endpoint', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    });

    it('debería realizar una petición POST con un cuerpo de datos', async () => {
        const postBody = { name: 'test' };
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: 1 }),
        });

        await apiFetch('/create', {
            method: 'POST',
            body: JSON.stringify(postBody),
        });

        // Verificamos que las opciones de la petición POST son correctas
        expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/create', {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('debería lanzar un error si la respuesta de la red no es "ok"', async () => {
        // Simulamos una respuesta de error del servidor (ej. 404 Not Found)
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
        });

        // Verificamos que la promesa es rechazada y lanza el error con el status code
        await expect(apiFetch('/non-existent')).rejects.toThrow('Error 404');
    });

    it('debería propagar errores de red (ej. fallo de conexión)', async () => {
        const networkError = new Error('Failed to fetch');
        // Simulamos un rechazo de la promesa de fetch
        mockFetch.mockRejectedValue(networkError);

        // Verificamos que el error de red es capturado y lanzado nuevamente
        await expect(apiFetch('/test')).rejects.toThrow(networkError);
    });
});