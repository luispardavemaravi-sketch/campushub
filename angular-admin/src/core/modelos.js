
/**
 * SportHub - Modelos orientados a objetos.
 * Clases principales: Usuario, Cancha y Reserva.
 */

export const aMinutos = (hhmm) => {
    const [horas, minutos] = hhmm.split(':').map(Number);
    return horas * 60 + minutos;
};

// =====================================================
// MODELO USUARIO
// =====================================================

export class Usuario {
    constructor({
        id,
        nombre,
        correo,
        codigo,
        rol = 'cliente',
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

// =====================================================
// MODELO CANCHA
// =====================================================

export class Cancha {
    constructor({
        id,
        nombre,
        complejo,
        capacidad,
        implementos = [],
        estado = 'disponible'
    } = {}) {
        Object.assign(this, {
            id,
            nombre,
            complejo,
            capacidad,
            implementos: [...implementos],
            estado
        });
    }

    get estaDisponible() {
        return this.estado === 'disponible';
    }

    tieneImplemento(nombre) {
        return this.implementos.some(
            (implemento) =>
                implemento.toLowerCase() === nombre.toLowerCase()
        );
    }
}

// =====================================================
// MODELO RESERVA
// =====================================================

export class Reserva {
    constructor({
        id,
        codigo,
        canchaId,
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
            canchaId,
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
     * 1. Pertenecen a la misma cancha.
     * 2. Corresponden a la misma fecha.
     * 3. Sus intervalos horarios se superponen.
     */
    seCruzaCon(otra) {
        return (
            String(this.canchaId) === String(otra.canchaId) &&
            this.fecha === otra.fecha &&
            aMinutos(this.horaInicio) < aMinutos(otra.horaFin) &&
            aMinutos(otra.horaInicio) < aMinutos(this.horaFin)
        );
    }
}
