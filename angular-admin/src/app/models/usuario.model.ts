
export type RolUsuario =
  | 'admin'
  | 'cliente';

/**
 * Usuario del sistema SportHub.
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
 * Representación pública sin contraseña.
 */
export type UsuarioPublico =
  Omit<Usuario, 'password'>;
