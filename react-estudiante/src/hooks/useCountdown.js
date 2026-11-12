import { useEffect, useState } from 'react';

function calcularTiempo(destino) {
  const diferencia = Math.max(
    0,
    new Date(destino).getTime() - Date.now()
  );

  return {
    dias: Math.floor(diferencia / 86400000),
    horas: Math.floor((diferencia % 86400000) / 3600000),
    minutos: Math.floor((diferencia % 3600000) / 60000),
    segundos: Math.floor((diferencia % 60000) / 1000),
    terminado: diferencia === 0
  };
}

export default function useCountdown(destino) {
  const [tiempo, setTiempo] = useState(
    () => (destino ? calcularTiempo(destino) : null)
  );

  useEffect(() => {
    if (!destino) {
      setTiempo(null);
      return undefined;
    }

    setTiempo(calcularTiempo(destino));

    const intervalo = window.setInterval(() => {
      setTiempo(calcularTiempo(destino));
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, [destino]);

  return tiempo;
}