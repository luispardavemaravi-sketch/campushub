export type EstadoReserva =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'cancelada';

export interface Reserva {
  id: number;
  codigo: string;
  canchaId: number;
  usuarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: EstadoReserva;
  creadoEn: string;

  motivoEstado?: string;
  canceladaEn?: string;
  canceladaPor?: string;

  // Datos de auditoría si se restaura una reserva.
  restauradaEn?: string;
  restauradaPor?: string;
  motivoRestauracion?: string;
}

export type ReservaPayload = Omit<Reserva, 'id'>;