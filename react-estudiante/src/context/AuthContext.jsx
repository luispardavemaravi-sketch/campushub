import { createContext, useContext, useState } from 'react';
import dbInicial from '../data/db.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sporthub_usuario')) || null;
    } catch {
      return null;
    }
  });

  function iniciarSesion(identificador, password) {

    const busqueda = identificador.trim().toLowerCase();

    const encontrado = dbInicial.usuarios.find(item => {
      const coincideCorreo =
        item.correo.toLowerCase() === busqueda;

      const coincideCodigo =
        item.codigo.toLowerCase() === busqueda;

      return (coincideCorreo || coincideCodigo) &&
        item.password === password;
    });

    if (!encontrado) {
      return {
        ok: false,
        mensaje: 'El código, correo o contraseña son incorrectos.'
      };
    }

    if (encontrado.rol !== 'cliente') {
      return {
        ok: false,
        mensaje: 'Esta cuenta corresponde al administrador. Utiliza el panel administrativo.'
      };
    }

    const usuarioSeguro = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      correo: encontrado.correo,
      codigo: encontrado.codigo,
      rol: encontrado.rol
    };

    setUsuario(usuarioSeguro);

    localStorage.setItem(
      'sporthub_usuario',
      JSON.stringify(usuarioSeguro)
    );

    return { ok: true };
  }

  function cerrarSesion() {
    setUsuario(null);
    localStorage.removeItem('sporthub_usuario');
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      autenticado: Boolean(usuario),
      iniciarSesion,
      cerrarSesion
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  //Guarda la información del usuario que inició sesión.
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }

  return contexto;
}