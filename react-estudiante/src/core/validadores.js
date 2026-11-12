
/**
 * SportHub - Validadores compartidos.
 * Expresiones regulares y reglas de validación.
 */

// =====================================================
// VALIDACIONES DE USUARIO
// =====================================================

// Se conserva el correo institucional UTP del proyecto original.
export const esCorreoUTP = (correo) =>
    typeof correo === 'string' &&
    /^[a-z\d._%+-]+@utp\.edu\.pe$/i.test(correo.trim());

// Se conserva el formato U + 8 dígitos solicitado en el proyecto.
export const esCodigoCliente = (codigo) =>
    typeof codigo === 'string' &&
    /^U\d{8}$/.test(codigo.trim());

// =====================================================
// VALIDACIONES GENERALES
// =====================================================

export const esHora = (hora) =>
    typeof hora === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

export const esFecha = (fecha) => {
    if (
        typeof fecha !== 'string' ||
        !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(fecha)
    ) {
        return false;
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);

    const verificada = new Date(0);
    verificada.setUTCHours(0, 0, 0, 0);
    verificada.setUTCFullYear(anio, mes - 1, dia);

    return (
        verificada.getUTCFullYear() === anio &&
        verificada.getUTCMonth() === mes - 1 &&
        verificada.getUTCDate() === dia
    );
};

// =====================================================
// VALIDACIONES DE CANCHA
// =====================================================

export const esNombreCancha = (nombre) =>
    typeof nombre === 'string' &&
    /^[\p{L}\p{N}][\p{L}\p{N}\s.\-]{2,59}$/u.test(nombre.trim());

export function validarCancha(datos = {}) {
    const errores = [];

    if (!esNombreCancha(datos.nombre)) {
        errores.push(
            `El nombre de la cancha debe tener entre 3 y 60 caracteres válidos.`
        );
    }

    if (
        typeof datos.complejo !== 'string' ||
        !datos.complejo.trim()
    ) {
        errores.push(`El complejo deportivo es obligatorio.`);
    }

    if (
        !Number.isInteger(datos.capacidad) ||
        datos.capacidad < 1 ||
        datos.capacidad > 60
    ) {
        errores.push(
            `La capacidad de jugadores debe ser un número entero entre 1 y 60.`
        );
    }

    if (
        !Array.isArray(datos.implementos) ||
        datos.implementos.some(
            (implemento) =>
                typeof implemento !== 'string' || !implemento.trim()
        )
    ) {
        errores.push(
            `Los implementos deben ser un arreglo de nombres no vacíos.`
        );
    }

    if (!['disponible', 'mantenimiento'].includes(datos.estado)) {
        errores.push(
            `El estado debe ser disponible o mantenimiento.`
        );
    }

    return errores;
}

// =====================================================
// VALIDACIONES DE RESERVA
// =====================================================

export function validarReserva(datos = {}) {
    const errores = [];

    if (
        !Number.isInteger(datos.canchaId) ||
        datos.canchaId <= 0
    ) {
        errores.push(`Debes seleccionar una cancha válida.`);
    }

    if (
        !Number.isInteger(datos.usuarioId) ||
        datos.usuarioId <= 0
    ) {
        errores.push(`Debes identificar al cliente.`);
    }

    if (!esFecha(datos.fecha)) {
        errores.push(
            `La fecha debe ser real y tener formato AAAA-MM-DD.`
        );
    }

    if (!esHora(datos.horaInicio)) {
        errores.push(`La hora de inicio debe usar HH:mm.`);
    }

    if (!esHora(datos.horaFin)) {
        errores.push(`La hora de fin debe usar HH:mm.`);
    }

    if (
        esHora(datos.horaInicio) &&
        esHora(datos.horaFin) &&
        datos.horaFin <= datos.horaInicio
    ) {
        errores.push(
            `La hora de fin debe ser posterior a la hora de inicio.`
        );
    }

    if (
        typeof datos.motivo !== 'string' ||
        !datos.motivo.trim()
    ) {
        errores.push(`El motivo de la reserva es obligatorio.`);
    }

    if (
        datos.estado !== undefined &&
        !['pendiente', 'aprobada', 'rechazada'].includes(datos.estado)
    ) {
        errores.push(`El estado de reserva no es válido.`);
    }

    return errores;
}
