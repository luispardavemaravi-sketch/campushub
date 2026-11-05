/**
 * CampusHub - Estadísticas con JavaScript avanzado.
 */

// Contar reservas agrupadas por estado
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

// Map: cantidad de reservas aprobadas por laboratorio
export function ocupacionPorLaboratorio(reservas = []) {
    return reservas
        .filter((reserva) => reserva.estado === 'aprobada')
        .reduce((mapa, reserva) => {
            const id = String(reserva.laboratorioId);

            mapa.set(id, (mapa.get(id) ?? 0) + 1);

            return mapa;
        }, new Map());
}

// Set: obtener sedes sin duplicados
export const sedesUnicas = (laboratorios = []) =>
    [
        ...new Set(
            laboratorios
                .map((laboratorio) => laboratorio.sede)
                .filter(Boolean)
        )
    ].sort();

// Ranking de laboratorios más reservados
export function rankingLaboratoriosMasReservados(
    laboratorios = [],
    reservas = []
) {
    const cantidades = reservas.reduce((mapa, reserva) => {
        const id = String(reserva.laboratorioId);

        mapa.set(id, (mapa.get(id) ?? 0) + 1);

        return mapa;
    }, new Map());

    return [...laboratorios]
        .map((laboratorio) => ({
            ...laboratorio,
            totalReservas:
                cantidades.get(String(laboratorio.id)) ?? 0
        }))
        .sort(
            (a, b) =>
                b.totalReservas - a.totalReservas ||
                String(a.nombre).localeCompare(String(b.nombre))
        );
}

// Closure: generar códigos RES-0001, RES-0002...
export function crearGeneradorCodigoReserva(inicio = 1) {
    if (!Number.isInteger(inicio) || inicio < 1) {
        throw new RangeError('El inicio debe ser positivo.');
    }

    let siguiente = inicio;

    return () =>
        `RES-${String(siguiente++).padStart(4, '0')}`;
}
