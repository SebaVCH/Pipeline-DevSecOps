import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Menu from './Menu';

describe('Menu', () => {
    const renderMenu = () => {
        render(
            <BrowserRouter>
                <Menu />
            </BrowserRouter>
        );
    };

    it('muestra el texto de bienvenida', () => {
        renderMenu();
        expect(screen.getByText('¡Bienvenido a Mental Notes!')).toBeInTheDocument();
    });

    it('muestra el botón de Iniciar Sesión', () => {
        renderMenu();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('muestra el botón de Registrarse', () => {
        renderMenu();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });
});