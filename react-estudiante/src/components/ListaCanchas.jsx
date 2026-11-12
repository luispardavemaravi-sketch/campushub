import TarjetaCancha from './TarjetaCancha.jsx';

export default function ListaCanchas({ canchas }) {
  if (!canchas.length) {
    return (
      <div className="empty-state">
        <span>⌕</span>
        <h3>No encontramos canchas</h3>
        <p>
          Prueba cambiando el texto o el complejo seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {canchas.map((cancha) => (
        <div className="col-sm-6 col-xl-4" key={cancha.id}>
          <TarjetaCancha cancha={cancha} />
        </div>
      ))}
    </div>
  );
}