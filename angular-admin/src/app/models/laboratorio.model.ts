
/**
 * Estados permitidos para un laboratorio.
 */
export type EstadoLaboratorio =
  | 'disponible'
  | 'mantenimiento';

/**
 * Entidad Laboratorio.
 * Representa los registros de db.json.
 */
export interface Laboratorio {
  id: number;
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: EstadoLaboratorio;
}

/**
 * Datos necesarios para crear o actualizar.
 * El ID lo administra json-server.
 */
export type LaboratorioPayload =
  Omit<Laboratorio, 'id'>;

/**
 * Filtros disponibles para consultar laboratorios.
 */
export interface FiltroLaboratorios {
  sede?: string;
  q?: string;
}
