import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';

import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

import BadgeEstado from '../components/BadgeEstado.jsx';

export default function MisReservasPage() {

  usePageTitle('Mis reservas');

  const { usuario } = useAuth();
  const { reservas, canchas } = useData();

  //---useState – Guardar y actualizar información
  //Aquí se guarda la lista de reservas del usuario.
  const [misReservas, setMisReservas] = useState([]);

  //---useEffect – Ejecutar acciones cuando algo cambia
  useEffect(() => {

    const resultado = reservas
      .filter(reserva =>
        Number(reserva.usuarioId) === Number(usuario.id)
      )
      .sort((a, b) =>
        `${b.fecha}${b.horaInicio}`.localeCompare(
          `${a.fecha}${a.horaInicio}`
        )
      );

    setMisReservas(resultado);

  }, [reservas, usuario.id]);

  return (
    <>
      <section className="page-heading mb-4">
        <span className="eyebrow">PORTAL DEL CLIENTE</span>
        <h1 className="section-title">Mis reservas</h1>

        <p className="muted">
          Consulta el historial y el estado de tus solicitudes.
        </p>
      </section>

      <div className="d-flex justify-content-end mb-4">
        <Link to="/nueva-reserva" className="btn btn-primary">
          + Nueva reserva
        </Link>
      </div>

      {misReservas.length > 0 ? (

        <div className="reservation-list">

          {misReservas.map(reserva => {

            const cancha = canchas.find(item =>
              Number(item.id) === Number(reserva.canchaId)
            );

            const fecha = new Date(
              `${reserva.fecha}T00:00:00`
            );

            return (
              <article
                className="reservation-card"
                key={reserva.id}
              >
                <div className="reservation-date">
                  <strong>{fecha.getDate()}</strong>

                  <span>
                    {fecha.toLocaleDateString('es-PE', {
                      month: 'short'
                    })}
                  </span>
                </div>

                <div className="reservation-info">
                  <span className="eyebrow">
                    {reserva.codigo}
                  </span>

                  <h2>{cancha?.nombre || 'Cancha no disponible'}</h2>

                  <p>
                    {reserva.fecha} · {reserva.horaInicio}
                    {' - '}
                    {reserva.horaFin}
                  </p>

                  <small>{reserva.motivo}</small>
                </div>

                <BadgeEstado estado={reserva.estado} />
              </article>
            );
          })}

        </div>

      ) : (

        <div className="empty-state">
          <span>▢</span>

          <h2>Aún no tienes reservas</h2>

          <p>
            Cuando registres una solicitud, aparecerá en esta sección.
          </p>

          <Link
            className="btn btn-primary"
            to="/nueva-reserva"
          >
            Crear mi primera reserva
          </Link>
        </div>

      )}
    </>
  );
}