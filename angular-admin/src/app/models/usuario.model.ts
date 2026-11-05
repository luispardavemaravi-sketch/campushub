
export type RolUsuario =
  | 'admin'
  | 'estudiante';

/**
 * Usuario del sistema CampusHub.
 */
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  codigo: string;
  rol: RolUsuario;
  password: string;
}

/**
 * Representación del usuario sin contraseña.
 */
export type UsuarioPublico =
  Omit<Usuario, 'password'>;
