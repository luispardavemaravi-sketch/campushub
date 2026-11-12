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