import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import dbInicial from '../data/db.json';
import { Reserva } from '../core/modelos.js';
import { validarReserva } from '../core/validadores.js';

const DataContext = createContext(null);

const ESTADOS_QUE_BLOQUEAN = [
  'pendiente',
  'aprobada'
];

function crearGeneradorCodigoReserva(inicio = 1) {
  let siguiente = inicio;

  return () => `RES-${String(siguiente++).padStart(4, '0')}`;
}

function codigoSiguiente(reservas) {
  return reservas.reduce((mayor, reserva) => {
    const numero = Number(reserva.codigo?.match(/^RES-(\d+)$/)?.[1] ?? 0);
    return Math.max(mayor, numero);
  }, 0) + 1;
}

export function DataProvider({ children }) {

  const [canchas] = useState(() => dbInicial.canchas);
  const [usuarios] = useState(() => dbInicial.usuarios);

  // Recuperamos las reservas guardadas o utilizamos las iniciales.
  const [reservas, setReservas] = useState(() => {
    try {
      const guardadas = localStorage.getItem('sporthub_reservas');
      const datosGuardados = guardadas ? JSON.parse(guardadas) : null;

      return Array.isArray(datosGuardados)
        ? datosGuardados
        : dbInicial.reservas;
    } catch {
      return dbInicial.reservas;
    }
  });

  const generarCodigo = useRef(null);
  if (!generarCodigo.current) {
    generarCodigo.current = crearGeneradorCodigoReserva(
      codigoSiguiente(reservas)
    );
  }

  // Guardamos los cambios sin modificar el db.json original.
  useEffect(() => {
    try {
      localStorage.setItem('sporthub_reservas', JSON.stringify(reservas));
    } catch (error) {
      console.error('No se pudieron guardar las reservas locales.', error);
    }
  }, [reservas]);

  function crearReserva(datos) {

    const errores = validarReserva(datos);
    if (errores.length) {
      return {
        ok: false,
        mensaje: errores.join(' ')
      };
    }

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
      codigo: generarCodigo.current(),
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
