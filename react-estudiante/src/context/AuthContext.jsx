import { createContext, useContext, useState } from 'react';
import dbInicial from '../data/db.json';
import { Usuario } from '../core/modelos.js';
import { esCodigoCliente, esCorreoUTP } from '../core/validadores.js';

const AuthContext = createContext(null);

function usuarioSeguro(usuario) {
  return new Usuario({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    codigo: usuario.codigo,
    rol: usuario.rol
  });
}

function leerSesion() {
  try {
    const guardado = JSON.parse(localStorage.getItem('sporthub_usuario'));
    const usuario = dbInicial.usuarios.find(
      item => Number(item.id) === Number(guardado?.id)
    );

    if (usuario?.rol !== 'estudiante') {
      localStorage.removeItem('sporthub_usuario');
      return null;
    }

    return usuarioSeguro(usuario);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(() => {
    return leerSesion();
  });

  function iniciarSesion(identificador, password) {

    const texto = identificador.trim();
    const busqueda = texto.toLowerCase();
    const codigo = texto.toUpperCase();

    if (!esCorreoUTP(texto) && !esCodigoCliente(codigo)) {
      return {
        ok: false,
        mensaje: 'Ingresa un correo institucional o un código U válido.'
      };
    }

    const encontrado = dbInicial.usuarios.find(item => {
      const coincideCorreo =
        item.correo.toLowerCase() === busqueda;

      const coincideCodigo = item.codigo === codigo;

      return (coincideCorreo || coincideCodigo) &&
        item.password === password;
    });

    if (!encontrado) {
      return {
        ok: false,
        mensaje: 'El código, correo o contraseña son incorrectos.'
      };
    }

    if (encontrado.rol !== 'estudiante') {
      return {
        ok: false,
        mensaje: 'Esta cuenta corresponde al administrador. Utiliza el panel administrativo.'
      };
    }

    const usuarioDeSesion = usuarioSeguro(encontrado);

    setUsuario(usuarioDeSesion);

    localStorage.setItem(
      'sporthub_usuario',
      JSON.stringify(usuarioDeSesion)
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
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }

  return contexto;
}
