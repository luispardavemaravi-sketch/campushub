import { Link } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle.js';

export default function NotFoundPage() {

  usePageTitle('Página no encontrada');

  return (
    <section className="not-found">

      <span className="not-found-code">404</span>

      <h1>Página no encontrada</h1>

      <p>
        La dirección que intentaste visitar no existe
        o ya no está disponible.
      </p>

      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>

        <Link to="/catalogo" className="btn btn-outline-primary">
          Ver canchas
        </Link>
      </div>

    </section>
  );
}