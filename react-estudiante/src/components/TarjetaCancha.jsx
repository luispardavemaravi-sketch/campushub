import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado.jsx';

export default function TarjetaCancha({ cancha }) {
  return (
    <article className="court-card h-100">
      <div className={`court-card-art art-${Number(cancha.id) % 4}`}>
        <span className="court-icon">⚽</span>

        <span className="court-capacity">
          Hasta {cancha.capacidad} jugadores
        </span>
      </div>

      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <span className="eyebrow">{cancha.complejo}</span>
          <BadgeEstado estado={cancha.estado} />
        </div>

        <h3 className="h5 fw-bold mb-2">
          {cancha.nombre}
        </h3>

        <p className="muted small mb-3">
          {cancha.implementos.slice(0, 3).join(' · ') ||
            'Espacio deportivo'}
        </p>

        <Link
          className="btn btn-outline-primary w-100"
          to={`/catalogo/${cancha.id}`}
        >
          Ver detalles <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}