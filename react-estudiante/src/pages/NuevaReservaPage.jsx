import { Link, useNavigate } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';
import FormularioReserva from '../components/FormularioReserva.jsx';

export default function NuevaReservaPage() {
  usePageTitle('Nueva reserva');

  const navegar = useNavigate();

  return (
    <div className="form-page">
      <section className="page-heading mb-4">
        <Link to="/catalogo" className="back-link">
          ← Volver al catálogo
        </Link>

        <span className="eyebrow d-block mt-4">
          RESERVA TU ESPACIO
        </span>

        <h1 className="section-title">Nueva reserva</h1>

        <p className="muted">
          Completa los datos para enviar tu solicitud.
        </p>
      </section>

      <div className="row g-4">
        <div className="col-lg-8">
          <FormularioReserva
            onCreada={() =>
              window.setTimeout(
                () => navegar('/mis-reservas'),
                1800
              )
            }
          />
        </div>

        <aside className="col-lg-4">
          <div className="info-panel">
            <span className="info-icon">✦</span>

            <h2 className="h5">Antes de reservar</h2>

            <ul>
              <li>Verifica la fecha y el horario.</li>
              <li>Las solicitudes quedan pendientes de aprobación.</li>
              <li>
                No se permiten horarios cruzados en una misma cancha.
              </li>
              <li>
                Las canchas en mantenimiento no se pueden reservar.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}