import { useMemo, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle.js';
import { useData } from '../context/DataContext.jsx';
import ListaCanchas from '../components/ListaCanchas.jsx';

export default function CatalogoPage() {
  usePageTitle('Catálogo de canchas');

  const { canchas } = useData();

  //----useState – Guardar y actualizar información
  //texto: guarda lo que el usuario escribe en el buscador.
  //complejo: guarda el complejo deportivo seleccionado.
  const [texto, setTexto] = useState('');
  const [complejo, setComplejo] = useState('todos');

  const complejos = [
    ...new Set(canchas.map((cancha) => cancha.complejo))
  ];

  const filtradas = useMemo(
    () =>
      canchas.filter((cancha) => {
        const coincideTexto = `
          ${cancha.nombre}
          ${cancha.complejo}
          ${cancha.implementos.join(' ')}
        `
          .toLowerCase()
          .includes(texto.toLowerCase());

        const coincideComplejo =
          complejo === 'todos' || cancha.complejo === complejo;

        return coincideTexto && coincideComplejo;
      }),
    [canchas, texto, complejo]
  );

  return (
    <>
      <section className="page-heading mb-4">
        <span className="eyebrow">CATÁLOGO SPORT HUB</span>
        <h1 className="section-title">Canchas deportivas</h1>
        <p className="muted">
          Explora los espacios, revisa sus características y elige dónde jugar.
        </p>
      </section>

      <section className="filter-panel mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-7">
            <label className="form-label" htmlFor="buscarCancha">
              Buscar cancha
            </label>

            <input
              id="buscarCancha"
              className="form-control"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Nombre, deporte o implemento..."
            />
          </div>

          <div className="col-md-5">
            <label className="form-label" htmlFor="filtroComplejo">
              Complejo deportivo
            </label>

            <select
              id="filtroComplejo"
              className="form-select"
              value={complejo}
              onChange={(evento) => setComplejo(evento.target.value)}
            >
              <option value="todos">Todos los complejos</option>

              {complejos.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-result mt-3">
          Mostrando <strong>{filtradas.length}</strong> de {canchas.length} canchas
        </div>
      </section>

      <ListaCanchas canchas={filtradas} />
    </>
  );
}