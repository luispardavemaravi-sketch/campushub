
/**
 * SportHub - Estadísticas con JavaScript avanzado.
 */

// =====================================================
// REDUCE: RESERVAS POR ESTADO
// =====================================================

export function reservasPorEstado(reservas = []) {
    return reservas.reduce(
        (conteo, reserva) => {
            const estado = reserva.estado;

            conteo[estado] = (conteo[estado] ?? 0) + 1;

            return conteo;
        },
        {
            pendiente: 0,
            aprobada: 0,
            rechazada: 0
        }
    );
}

// =====================================================
// MAP: OCUPACIÓN POR CANCHA
// =====================================================

export function ocupacionPorCancha(reservas = []) {
    return reservas
        .filter((reserva) => reserva.estado === 'aprobada')
        .reduce((mapa, reserva) => {
            const id = String(reserva.canchaId);

            mapa.set(id, (mapa.get(id) ?? 0) + 1);

            return mapa;
        }, new Map());
}

// =====================================================
// SET: COMPLEJOS DEPORTIVOS SIN DUPLICADOS
// =====================================================

export const complejosUnicos = (canchas = []) =>
    [
        ...new Set(
            canchas
                .map((cancha) => cancha.complejo)
                .filter(Boolean)
        )
    ].sort();

// =====================================================
// SORT Y SPREAD: RANKING DE CANCHAS MÁS RESERVADAS
// =====================================================

export function rankingCanchasMasReservadas(
    canchas = [],
    reservas = []
) {
    const cantidades = reservas.reduce((mapa, reserva) => {
        const id = String(reserva.canchaId);

        mapa.set(id, (mapa.get(id) ?? 0) + 1);

        return mapa;
    }, new Map());

    return [...canchas]
        .map((cancha) => ({
            ...cancha,
            totalReservas:
                cantidades.get(String(cancha.id)) ?? 0
        }))
        .sort(
            (a, b) =>
                b.totalReservas - a.totalReservas ||
                String(a.nombre).localeCompare(String(b.nombre))
        );
}

// =====================================================
// CLOSURE: GENERADOR DE CÓDIGOS DE RESERVA
// =====================================================

export function crearGeneradorCodigoReserva(inicio = 1) {
    if (!Number.isInteger(inicio) || inicio < 1) {
        throw new RangeError('El inicio debe ser positivo.');
    }

    let siguiente = inicio;

    return () =>
        `RES-${String(siguiente++).padStart(4, '0')}`;
}
