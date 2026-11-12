import { useState } from 'react';

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {

  usePageTitle('Iniciar sesión');

  const [identificador, setIdentificador] = useState('U20231234');
  const [password, setPassword] = useState('cliente123');
  const [error, setError] = useState('');

  const { iniciarSesion } = useAuth();

  const navegar = useNavigate();
  const ubicacion = useLocation();

  function enviar(evento) {
    evento.preventDefault();

    const resultado = iniciarSesion(
      identificador,
      password
    );

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    navegar(
      ubicacion.state?.desde || '/mis-reservas',
      { replace: true }
    );
  }

  return (
    <div className="login-layout">

      <section className="login-aside">
        <span className="eyebrow">BIENVENIDO A SPORTHUB</span>

        <h1>Tu próximo partido comienza aquí.</h1>

        <p>
          Ingresa a tu cuenta y organiza tus reservas
          de espacios deportivos.
        </p>

        <div className="login-decoration">⚽</div>
      </section>

      <section className="login-form-wrap">
        <span className="eyebrow">PORTAL DEL CLIENTE</span>

        <h2>Iniciar sesión</h2>

        <p className="muted mb-4">
          Ingresa tu código universitario o correo institucional.
        </p>

        <form onSubmit={enviar}>
          <div className="mb-3">
            <label className="form-label" htmlFor="identificador">
              Código de estudiante o correo
            </label>

            <input
              id="identificador"
              type="text"
              className="form-control"
              value={identificador}
              onChange={evento => setIdentificador(evento.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={evento => setPassword(evento.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-lg w-100"
            type="submit"
          >
            Ingresar al portal
          </button>
        </form>

        <div className="demo-credentials mt-4">
          <strong>Cuenta de demostración</strong>
          <span>Código: U20231234</span>
          <span>Contraseña: cliente123</span>
        </div>

        <p className="small muted mt-4 mb-0">
          ¿Solo deseas explorar?{' '}
          <Link to="/catalogo">Ver catálogo de canchas</Link>
        </p>
      </section>
    </div>
  );
}