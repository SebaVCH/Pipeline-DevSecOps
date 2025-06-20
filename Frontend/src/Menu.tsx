import { useNavigate } from 'react-router-dom';
import './Menu.css'; // Puedes crear este archivo CSS para estilizar el componente

function Menu() {
    const navigate = useNavigate();

    return (
        <div className="menu-container">
            <div className="menu-content">
                <h1>¡Bienvenido a Mental Notes!</h1>
                <p>Tu aplicación para gestionar notas personales de manera segura</p>

                <div className="buttons-container">
                    <button
                        className="menu-button login-button"
                        onClick={() => navigate('/login')}
                    >
                        Iniciar Sesión
                    </button>

                    <button
                        className="menu-button register-button"
                        onClick={() => navigate('/register')}
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Menu;