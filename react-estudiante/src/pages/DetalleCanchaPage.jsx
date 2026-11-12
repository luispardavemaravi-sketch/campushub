import { Link, useParams } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';
import { useData } from '../context/DataContext.jsx';
import BadgeEstado from '../components/BadgeEstado.jsx';

export default function DetalleCanchaPage() {
  const { id } = useParams();  //useParams() sirve para leer los parámetros dinámicos de la URL
  const { canchas } = useData();

  const cancha = canchas.find(
    (item) => String(item.id) === id
  );

  usePageTitle(
    cancha ? cancha.nombre : 'Cancha no encontrada'
  );

  if (!cancha) {
    return (
      <div className="empty-state">
        <h1>Cancha no encontrada</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="detail-layout">
      <div className={`detail-art art-${Number(cancha.id) % 4}`}>
        <span>⚽</span>
        <small>SPORT HUB · ESPACIO DEPORTIVO</small>
      </div>

      <section className="detail-content">
        <Link to="/catalogo" className="back-link">
          ← Volver al catálogo
        </Link>

        <div className="d-flex align-items-center gap-2 mt-4 mb-3">
          <span className="eyebrow">DETALLE DE CANCHA</span>
          <BadgeEstado estado={cancha.estado} />
        </div>

        <h1 className="section-title">{cancha.nombre}</h1>

        <p className="muted">{cancha.complejo}</p>

        <div className="detail-facts">
          <div>
            <small>CAPACIDAD</small>
            <strong>{cancha.capacidad} jugadores</strong>
          </div>

          <div>
            <small>ESTADO</small>
            <strong>
              {cancha.estado === 'disponible'
                ? 'Disponible'
                : 'Mantenimiento'}
            </strong>
          </div>
        </div>

        <h2 className="h5 fw-bold mt-4">
          Implementos disponibles
        </h2>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {cancha.implementos.map((item) => (
            <span className="equipment-chip" key={item}>
              {item}
            </span>
          ))}
        </div>

        {cancha.estado === 'disponible' ? (
          <Link className="btn btn-primary btn-lg" to="/nueva-reserva">
            Solicitar reserva
          </Link>
        ) : (
          <p className="alert alert-warning">
            Esta cancha se encuentra en mantenimiento y no admite nuevas solicitudes.
          </p>
        )}
      </section>
    </div>
  );
}