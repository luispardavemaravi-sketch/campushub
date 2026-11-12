import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import dbInicial from '../data/db.json';
import { Reserva } from '../core/modelos.js';

const DataContext = createContext(null);

const ESTADOS_QUE_BLOQUEAN = [
  'pendiente',
  'aprobada'
];

export function DataProvider({ children }) {

  const [canchas] = useState(dbInicial.canchas);
  const [usuarios] = useState(dbInicial.usuarios);

  // Recuperamos las reservas guardadas o utilizamos las iniciales.
  const [reservas, setReservas] = useState(() => {
    try {
      const guardadas = localStorage.getItem('sporthub_reservas');

      return guardadas
        ? JSON.parse(guardadas)
        : dbInicial.reservas;
    } catch {
      return dbInicial.reservas;
    }
  });

  // Guardamos los cambios sin modificar el db.json original.
  useEffect(() => {
    localStorage.setItem(
      'sporthub_reservas',
      JSON.stringify(reservas)
    );
  }, [reservas]);

  function crearReserva(datos) {

    const cancha = canchas.find(
      item => Number(item.id) === Number(datos.canchaId)
    );

    if (!cancha || cancha.estado !== 'disponible') {
      return {
        ok: false,
        mensaje: 'La cancha seleccionada no está disponible.'
      };
    }

    const candidata = new Reserva(datos);

    // Una solicitud pendiente o aprobada bloquea ese horario.
    const existeCruce = reservas.some(reserva => {

      if (!ESTADOS_QUE_BLOQUEAN.includes(reserva.estado)) {
        return false;
      }

      return candidata.seCruzaCon(new Reserva(reserva));
    });

    if (existeCruce) {
      return {
        ok: false,
        mensaje: 'Ese horario ya tiene una reserva pendiente o aprobada.'
      };
    }

    const siguienteId =
      Math.max(
        0,
        ...reservas.map(item => Number(item.id))
      ) + 1;

    const nueva = new Reserva({
      ...datos,
      id: siguienteId,
      codigo: `RES-${String(siguienteId).padStart(4, '0')}`,
      estado: 'pendiente',
      creadoEn: new Date().toISOString()
    });

    setReservas(actuales => [...actuales, nueva]);

    return {
      ok: true,
      reserva: nueva
    };
  }

  return (
    <DataContext.Provider
      value={{
        canchas,
        usuarios,
        reservas,
        crearReserva
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const contexto = useContext(DataContext);

  if (!contexto) {
    throw new Error(
      'useData debe utilizarse dentro de DataProvider.'
    );
  }

  return contexto;
}