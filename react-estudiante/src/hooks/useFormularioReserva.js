import { useEffect, useRef, useState } from 'react';

import {
  esFecha,
  esHora,
  validarReserva
} from '../core/validadores.js';

import { Reserva } from '../core/modelos.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';

const inicial = {
  canchaId: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  motivo: ''
};

function fechaLocal() {
  const hoy = new Date();

  return [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0')
  ].join('-');
}

function horaLocal() {
  const ahora = new Date();

  return [
    String(ahora.getHours()).padStart(2, '0'),
    String(ahora.getMinutes()).padStart(2, '0')
  ].join(':');
}

export default function useFormularioReserva(onCreada) {

  const [formulario, setFormulario] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  //---useRef – Acceder directamente a un elemento
  //Cuando se abre el formulario, automáticamente se coloca el 
  // cursor en el primer campo, que en tu caso es la selección de cancha.
//También se vuelve a enfocar después de guardar una reserva:
  const campoInicial = useRef(null);

  const { usuario } = useAuth();
  const { canchas, reservas, crearReserva } = useData();

  useEffect(() => {
    campoInicial.current?.focus();
  }, []);

  function cambiar(evento) {
    const { name, value } = evento.target;

    setFormulario(actual => ({
      ...actual,
      [name]: value
    }));

    setErrores(actual => ({
      ...actual,
      [name]: ''
    }));

    setMensaje('');
  }

  function enviar(evento) {
    evento.preventDefault();

    const datos = {
      ...formulario,
      canchaId: Number(formulario.canchaId),
      usuarioId: Number(usuario.id),
      estado: 'pendiente'
    };

    const nuevosErrores = {};

    const cancha = canchas.find(
      item => Number(item.id) === datos.canchaId
    );

    if (!cancha) {
      nuevosErrores.canchaId = 'Selecciona una cancha válida.';
    } else if (cancha.estado !== 'disponible') {
      nuevosErrores.canchaId = 'La cancha está en mantenimiento.';
    }

    if (!esFecha(datos.fecha) || datos.fecha < fechaLocal()) {
      nuevosErrores.fecha = 'Selecciona una fecha válida que no haya pasado.';
    }

    if (!esHora(datos.horaInicio)) {
      nuevosErrores.horaInicio = 'Ingresa una hora de inicio válida.';
    }

    if (!esHora(datos.horaFin)) {
      nuevosErrores.horaFin = 'Ingresa una hora de finalización válida.';
    }

    if (esHora(datos.horaInicio) && esHora(datos.horaFin)) {

      if (datos.horaInicio < '07:30' || datos.horaInicio >= '22:00') {
        nuevosErrores.horaInicio =
          'El horario permitido comienza a las 7:30 a. m. y termina antes de las 10:00 p. m.';
      }

      if (datos.horaFin > '22:00') {
        nuevosErrores.horaFin =
          'La hora de finalización no puede superar las 10:00 p. m.';
      }

      if (datos.horaFin <= datos.horaInicio) {
        nuevosErrores.horaFin =
          'La hora final debe ser posterior a la inicial.';
      }

      if (
        datos.fecha === fechaLocal() &&
        datos.horaInicio <= horaLocal()
      ) {
        nuevosErrores.horaInicio =
          'La hora de inicio debe ser posterior a la hora actual.';
      }
    }

    if (!datos.motivo.trim()) {
      nuevosErrores.motivo = 'El motivo de la reserva es obligatorio.';
    }

    const erroresCore = validarReserva(datos);

    if (erroresCore.length && !Object.keys(nuevosErrores).length) {
      nuevosErrores.general = erroresCore[0];
    }

    // Comprobamos los cruces con solicitudes pendientes y aprobadas.
    if (!Object.keys(nuevosErrores).length) {
      const candidata = new Reserva(datos);

      const cruce = reservas.some(reserva =>
        ['pendiente', 'aprobada'].includes(reserva.estado) &&
        candidata.seCruzaCon(new Reserva(reserva))
      );

      if (cruce) {
        nuevosErrores.horaInicio =
          'Ese horario ya está ocupado en la cancha seleccionada.';
      }
    }

    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return;
    }

    const resultado = crearReserva(datos);

    if (!resultado.ok) {
      setErrores({ general: resultado.mensaje });
      return;
    }

    setFormulario(inicial);
    setErrores({});

    setMensaje(
      `La solicitud ${resultado.reserva.codigo} se registró correctamente.`
    );

    campoInicial.current?.focus();

    onCreada?.(resultado.reserva);
  }

  return {
    formulario,
    errores,
    mensaje,
    campoInicial,
    canchas,
    fechaMinima: fechaLocal(),
    cambiar,
    enviar
  };
}