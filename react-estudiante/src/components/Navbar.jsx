import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar({ nombreMarca = 'SportHub' }) {
  const { usuario, autenticado, cerrarSesion } = useAuth();
  const { tema, alternarTema } = useTheme();

  const navegar = useNavigate();

  function salir() {
    cerrarSesion();
    navegar('/');
  }

  return (
    <header className="topbar">
      <nav className="container navbar navbar-expand-lg navbar-dark py-3">
        <Link className="navbar-brand brand-mark" to="/">
          <span className="brand-symbol">S</span>

          <span>
            {nombreMarca.replace('Hub', '')}
            <span>Hub</span>
            <small>PORTAL DEPORTIVO</small>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuSportHub"
          aria-controls="menuSportHub"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="menuSportHub">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/" end>
              Inicio
            </NavLink>

            <NavLink className="nav-link" to="/catalogo">
              Canchas
            </NavLink>

            {autenticado && (
              <NavLink className="nav-link" to="/mis-reservas">
                Mis reservas
              </NavLink>
            )}

            {autenticado && (
              <NavLink
                className="btn btn-nav-primary ms-lg-2"
                to="/nueva-reserva"
              >
                Reservar cancha
              </NavLink>
            )}

            <button
              className="btn btn-theme ms-lg-2"
              onClick={alternarTema}
              type="button"
              aria-label="Cambiar tema"
            >
              {tema === 'claro' ? '☾' : '☀'}
              <span className="d-lg-none">Cambiar tema</span>
            </button>

            {autenticado ? (
              <button
                className="btn btn-outline-light ms-lg-2"
                onClick={salir}
                type="button"
              >
                {usuario.nombre.split(' ')[0]} · Salir
              </button>
            ) : (
              <NavLink
                className="btn btn-outline-light ms-lg-2"
                to="/login"
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}