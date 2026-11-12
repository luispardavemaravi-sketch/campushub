//permite utilizar el componente TarjetaCancha
import TarjetaCancha from './TarjetaCancha.jsx';

// Recibe la prop canchas desde CatalogoPage.jsx.
// Contiene la lista de canchas que se mostrarán en el catálogo.
export default function ListaCanchas({ canchas }) {

  //Renderizado Condicional: Es mostrar algo solamente cuando se cumple una condición.
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

  //En caso si hayan canchas deportivas registradas, entonces
  //recibe la lista de canchas, recorre cada uno y por cada cancha genera una tarjeta
  //La propiedad key permite a React identificar cada elemento de la lista
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