import { Link } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

import ResumenProximaReserva from '../components/ResumenProximaReserva.jsx';

function MetricasCatalogo({ total, disponibles, complejos }) {
  return (
    <div className="row g-3 mb-5">
      <div className="col-md-4">
        <div className="metric-card">
          <span>◈</span><strong>{total}</strong><small>Canchas registradas</small>
        </div>
      </div>
      <div className="col-md-4">
        <div className="metric-card">
          <span>✓</span><strong>{disponibles}</strong><small>Canchas disponibles</small>
        </div>
      </div>
      <div className="col-md-4">
        <div className="metric-card">
          <span>⌖</span><strong>{complejos}</strong><small>Complejos deportivos</small>
        </div>
      </div>
    </div>
  );
}

function CanchasDestacadas({ canchas }) {
  return (
    <div className="row g-4">
      {canchas
        .filter(cancha => cancha.estado === 'disponible')
        .slice(0, 3)
        .map(cancha => (
          <div className="col-md-4" key={cancha.id}>
            <div className="feature-card">
              <div className="feature-icon">
                {cancha.nombre.toLowerCase().includes('vóley')
                  ? '🏐'
                  : cancha.nombre.toLowerCase().includes('tenis')
                    ? '🎾'
                    : '⚽'}
              </div>
              <h3>{cancha.nombre}</h3>
              <p>{cancha.complejo}</p>
              <Link to={`/catalogo/${cancha.id}`}>
                Conocer cancha →
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default function InicioPage() {

  usePageTitle('Inicio');

  const { usuario, autenticado } = useAuth();
  const { canchas, reservas } = useData();

  // Buscamos la próxima solicitud pendiente o aprobada del estudiante.
  const proxima = autenticado
    ? reservas
        .filter(reserva =>
          Number(reserva.usuarioId) === Number(usuario.id) &&
          ['pendiente', 'aprobada'].includes(reserva.estado) &&
          new Date(`${reserva.fecha}T${reserva.horaInicio}:00`) > new Date()
        )
        .sort((a, b) =>
          new Date(`${a.fecha}T${a.horaInicio}:00`) -
          new Date(`${b.fecha}T${b.horaInicio}:00`)
        )[0]
    : null;

  const canchaProxima = proxima
    ? canchas.find(item =>
        Number(item.id) === Number(proxima.canchaId)
      )
    : null;

  const disponibles = canchas.filter(
    cancha => cancha.estado === 'disponible'
  ).length;

  const complejos = new Set(
    canchas.map(cancha => cancha.complejo)
  ).size;

  return (
    <>
      <section className="hero-panel mb-4">
        <div className="hero-copy">
          <span className="hero-kicker">
            SPORT · COMMUNITY · EXPERIENCE
          </span>

          <h1>
            El deporte empieza
            <br />
            <span>con un buen espacio.</span>
          </h1>

          <p>
            Encuentra tu cancha ideal, organiza tu partido
            y reserva tu próximo encuentro con SportHub.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-light btn-lg" to="/catalogo">
              Explorar canchas
            </Link>

            <Link
              className="btn btn-hero-outline btn-lg"
              to={autenticado ? '/nueva-reserva' : '/login'}
            >
              {autenticado ? 'Reservar ahora' : 'Iniciar sesión'}
            </Link>
          </div>
        </div>

        <div className="hero-graphic" aria-hidden="true">
          <div className="hero-ball">⚽</div>
          <div className="hero-ring ring-one" />
          <div className="hero-ring ring-two" />
          <span className="hero-tag">JUEGA A TU MANERA</span>
        </div>
      </section>

      {autenticado && (
        <ResumenProximaReserva
          reserva={proxima}
          cancha={canchaProxima}
        />
      )}

      <section className="section-heading my-4">
        <div>
          <span className="eyebrow">DESCUBRE SPORTHUB</span>
          <h2 className="section-title">Nuestras canchas</h2>
          <p className="muted mb-0">
            Consulta los espacios deportivos disponibles.
          </p>
        </div>

        <Link to="/catalogo" className="text-link">
          Ver catálogo completo →
        </Link>
      </section>

      <MetricasCatalogo
        total={canchas.length}
        disponibles={disponibles}
        complejos={complejos}
      />

      <CanchasDestacadas canchas={canchas} />
    </>
  );
}
