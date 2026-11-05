
export type EstadoReserva =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada';

/**
 * Representación de una reserva del API.
 */
export interface Reserva {
  id: number;
  codigo: string;
  laboratorioId: number;
  usuarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: EstadoReserva;
  creadoEn: string;
}

/**
 * Datos de una nueva reserva.
 */
export type ReservaPayload =
  Omit<Reserva, 'id'>;
