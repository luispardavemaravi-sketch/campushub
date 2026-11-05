/**
 * CampusHub - Modelos orientados a objetos.
 */

export const aMinutos = (hhmm) => {
    const [horas, minutos] = hhmm.split(':').map(Number);
    return horas * 60 + minutos;
};

export class Usuario {
    constructor({
        id,
        nombre,
        correo,
        codigo,
        rol = 'estudiante',
        password
    } = {}) {
        Object.assign(this, {
            id,
            nombre,
            correo,
            codigo,
            rol,
            password
        });
    }

    get esAdministrador() {
        return this.rol === 'admin';
    }

    get identificacion() {
        return `${this.nombre} (${this.codigo})`;
    }
}

export class Laboratorio {
    constructor({
        id,
        nombre,
        sede,
        capacidad,
        equipos = [],
        estado = 'disponible'
    } = {}) {
        Object.assign(this, {
            id,
            nombre,
            sede,
            capacidad,
            equipos: [...equipos],
            estado
        });
    }

    get estaDisponible() {
        return this.estado === 'disponible';
    }

    tieneEquipo(nombre) {
        return this.equipos.some(
            (equipo) => equipo.toLowerCase() === nombre.toLowerCase()
        );
    }
}

export class Reserva {
    constructor({
        id,
        codigo,
        laboratorioId,
        usuarioId,
        fecha,
        horaInicio,
        horaFin,
        motivo = '',
        estado = 'pendiente',
        creadoEn
    } = {}) {
        Object.assign(this, {
            id,
            codigo,
            laboratorioId,
            usuarioId,
            fecha,
            horaInicio,
            horaFin,
            motivo,
            estado,
            creadoEn
        });
    }

    get esActiva() {
        return this.estado !== 'rechazada';
    }

    duracionHoras() {
        return (
            aMinutos(this.horaFin) - aMinutos(this.horaInicio)
        ) / 60;
    }

    /**
     * Dos reservas se cruzan cuando:
     * 1. Pertenecen al mismo laboratorio.
     * 2. Corresponden a la misma fecha.
     * 3. Sus intervalos horarios se superponen.
     */
    seCruzaCon(otra) {
        return (
            String(this.laboratorioId) === String(otra.laboratorioId) &&
            this.fecha === otra.fecha &&
            aMinutos(this.horaInicio) < aMinutos(otra.horaFin) &&
            aMinutos(otra.horaInicio) < aMinutos(this.horaFin)
        );
    }
}
