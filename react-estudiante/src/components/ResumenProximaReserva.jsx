import { Link } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown.js';

export default function ResumenProximaReserva({
  reserva,
  cancha
}) {
  const cuenta = useCountdown(
    reserva
      ? `${reserva.fecha}T${reserva.horaInicio}:00`
      : null
  );

  if (!reserva) {
    return (
      <section className="next-reservation empty-next">
        <div>
          <span className="eyebrow">MIS ACTIVIDADES</span>
          <h2>Aún no tienes una reserva próxima</h2>
          <p>Encuentra una cancha y organiza tu próximo partido.</p>
        </div>

        <Link className="btn btn-primary" to="/nueva-reserva">
          Reservar cancha
        </Link>
      </section>
    );
  }

  return (
    <section className="next-reservation">
      <div className="next-reservation-info">
        <span className="eyebrow">TU PRÓXIMA RESERVA</span>

        <h2>{cancha?.nombre || 'Cancha deportiva'}</h2>

        <p>
          {reserva.fecha} · {reserva.horaInicio} a {reserva.horaFin}
        </p>

        <span className={`status-badge status-${reserva.estado}`}>
          {reserva.estado}
        </span>
      </div>

      <div className="next-countdown">
        <span className="eyebrow">TIEMPO RESTANTE</span>

        {cuenta && (
          <div className="countdown-values">
            <strong>{cuenta.dias}d</strong>
            <strong>{cuenta.horas}h</strong>
            <strong>{cuenta.minutos}m</strong>
            <strong>{cuenta.segundos}s</strong>
          </div>
        )}

        <small>{reserva.codigo}</small>
      </div>

      <Link to="/mis-reservas" className="next-detail-link">
        Ver mis reservas →
      </Link>
    </section>
  );
}