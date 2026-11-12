import { cloneElement } from 'react';

export default function CampoReserva({
  id,
  etiqueta,
  error,
  children
}) {
  const campo = error
    ? cloneElement(children, {
        className: `${children.props.className || ''} is-invalid`
      })
    : children;

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {etiqueta}
      </label>

      {campo}

      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}

export function SelectorCancha({
  canchas,
  valor,
  error,
  campoInicial,
  cambiar
}) {
  return (
    <CampoReserva
      id="canchaId"
      etiqueta="Cancha deportiva"
      error={error}
    >
      <select
        ref={campoInicial}
        id="canchaId"
        name="canchaId"
        className="form-select"
        value={valor}
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
  );
}
