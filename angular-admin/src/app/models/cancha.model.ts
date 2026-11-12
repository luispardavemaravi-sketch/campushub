
export type EstadoCancha =
  | 'disponible'
  | 'mantenimiento';

/**
 * Representa una cancha deportiva.
 */
export interface Cancha {
  id: number;
  nombre: string;
  complejo: string;
  capacidad: number;
  implementos: string[];
  estado: EstadoCancha;
}

/**
 * Datos para registrar o actualizar una cancha.
 */
export type CanchaPayload = Omit<Cancha, 'id'>;

/**
 * Filtros de búsqueda de canchas.
 */
export interface FiltroCanchas {
  complejo?: string;
  q?: string;
}
