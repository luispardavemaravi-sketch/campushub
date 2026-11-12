import { useEffect } from 'react';

export default function usePageTitle(titulo) {

  //---useEffect – Ejecutar acciones cuando algo cambia
  //Cuando ingresas a una página, cambia el título que 
  // aparece en la pestaña del navegador.
  //"Catálogo de canchas | SportHub". o "Mis reservas | SportHub".
  useEffect(() => {
    document.title = `${titulo} | SportHub`;
  }, [titulo]);
}