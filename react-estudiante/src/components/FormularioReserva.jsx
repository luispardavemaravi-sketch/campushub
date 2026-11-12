//Permite que el cliente registre una solicitud de reserva.

//Este componente utiliza otro componente llamado CampoReserva.jsx, que 
//sirve para reutilizar la estructura de los campos y mostrar sus errores.
import CampoReserva from './CampoReserva.jsx';

//También utiliza el hook personalizado useFormularioReserva.js, 
//donde se encuentra gran parte de la lógica de validación y registro
import useFormularioReserva from '../hooks/useFormularioReserva.js';

// Recibe la prop onCreada desde NuevaReservaPage.jsx.
export default function FormularioReserva({ onCreada }) {

  const {
    formulario,
    errores,
    mensaje,
    campoInicial,
    canchas,
    fechaMinima,
    cambiar,
    enviar
  } = useFormularioReserva(onCreada);

  return (
    <form className="form-panel" onSubmit={enviar} noValidate>

      <CampoReserva
        id="canchaId"
        etiqueta="Cancha deportiva"
        error={errores.canchaId}
      >
        <select
          ref={campoInicial}
          id="canchaId"
          name="canchaId"
          className="form-select"
          value={formulario.canchaId}
          onChange={cambiar}
        >
          <option value="">Selecciona una cancha</option>

          {canchas.map(cancha => (
            <option
              key={cancha.id}
              value={cancha.id}
              disabled={cancha.estado !== 'disponible'}
            >
              {cancha.nombre} · {cancha.complejo}
              {cancha.estado !== 'disponible' ? ' (Mantenimiento)' : ''}
            </option>
          ))}
        </select>
      </CampoReserva>

      <CampoReserva
        id="fecha"
        etiqueta="Fecha de reserva"
        error={errores.fecha}
      >
        <input
          id="fecha"
          name="fecha"
          type="date"
          min={fechaMinima}
          className="form-control"
          value={formulario.fecha}
          onChange={cambiar}
        />
      </CampoReserva>

      <div className="row g-3">
        <div className="col-md-6">
          <CampoReserva
            id="horaInicio"
            etiqueta="Hora de inicio"
            error={errores.horaInicio}
          >
            <input
              id="horaInicio"
              name="horaInicio"
              type="time"
              min="07:30"
              max="21:59"
              className="form-control"
              value={formulario.horaInicio}
              onChange={cambiar}
            />
          </CampoReserva>
        </div>

        <div className="col-md-6">
          <CampoReserva
            id="horaFin"
            etiqueta="Hora de finalización"
            error={errores.horaFin}
          >
            <input
              id="horaFin"
              name="horaFin"
              type="time"
              min="07:30"
              max="22:00"
              className="form-control"
              value={formulario.horaFin}
              onChange={cambiar}
            />
          </CampoReserva>
        </div>
      </div>

      <CampoReserva
        id="motivo"
        etiqueta="Motivo de la reserva"
        error={errores.motivo}
      >
        <textarea
          id="motivo"
          name="motivo"
          rows="3"
          maxLength="120"
          className="form-control"
          value={formulario.motivo}
          onChange={cambiar}
          placeholder="Ej. Entrenamiento de vóley"
        />
      </CampoReserva>

      {errores.general && (
        <div className="alert alert-danger">
          {errores.general}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <button className="btn btn-primary btn-lg w-100" type="submit">
        Enviar solicitud de reserva
      </button>

      <p className="form-note mt-3 mb-0">
        Las solicitudes se guardan localmente y quedan pendientes.
      </p>
    </form>
  );
}