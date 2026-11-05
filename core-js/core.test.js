import test from 'node:test';
import assert from 'node:assert/strict';

import {
    esCorreoUTP,
    esCodigoAlumno,
    esHora,
    esFecha,
    esNombreLaboratorio,
    validarLaboratorio,
    validarReserva
} from './validadores.js';

import {
    Usuario,
    Laboratorio,
    Reserva
} from './modelos.js';

import {
    reservasPorEstado,
    ocupacionPorLaboratorio,
    sedesUnicas,
    rankingLaboratoriosMasReservados,
    crearGeneradorCodigoReserva
} from './estadisticas.js';

const lab = {
    nombre: 'Lab A-301',
    sede: 'Lima Centro',
    capacidad: 30,
    equipos: ['PC i7', 'Proyector'],
    estado: 'disponible'
};

const reserva = {
    laboratorioId: 1,
    usuarioId: 3,
    fecha: '2026-11-20',
    horaInicio: '08:00',
    horaFin: '10:00',
    motivo: 'Práctica de React',
    estado: 'pendiente'
};

test('correo institucional UTP: válido e inválido', () => {
    assert.equal(esCorreoUTP('alumno@utp.edu.pe'), true);
    assert.equal(esCorreoUTP('alumno@gmail.com'), false);
});

test('código estudiantil: U seguido de ocho dígitos', () => {
    assert.equal(esCodigoAlumno('U20231234'), true);
    assert.equal(esCodigoAlumno('A20231234'), false);
});

test('hora HH:mm respeta límites', () => {
    assert.equal(esHora('23:59'), true);
    assert.equal(esHora('24:00'), false);
    assert.equal(esHora('9:00'), false);
});

test('fecha válida incluyendo años bisiestos', () => {
    assert.equal(esFecha('2028-02-29'), true);
    assert.equal(esFecha('2026-02-29'), false);
    assert.equal(esFecha('2026-13-01'), false);
});

test('nombre admite el formato Lab A-301', () => {
    assert.equal(esNombreLaboratorio('Lab A-301'), true);
    assert.equal(esNombreLaboratorio('!!'), false);
});

test('laboratorio válido no produce errores', () => {
    assert.deepEqual(validarLaboratorio(lab), []);
});

test('capacidad debe estar entre 1 y 60', () => {
    assert.match(
        validarLaboratorio({ ...lab, capacidad: 61 }).join(' '),
        /capacidad/
    );

    assert.match(
        validarLaboratorio({ ...lab, capacidad: 0 }).join(' '),
        /capacidad/
    );
});

test('horaFin debe ser posterior a horaInicio', () => {
    assert.deepEqual(validarReserva(reserva), []);

    assert.match(
        validarReserva({
            ...reserva,
            horaFin: '07:00'
        }).join(' '),
        /posterior/
    );
});

test('Usuario tiene getter de administrador', () => {
    const usuario = new Usuario({
        nombre: 'Ana',
        codigo: 'A00000001',
        rol: 'admin'
    });

    assert.equal(usuario.esAdministrador, true);
});

test('Laboratorio verifica equipos', () => {
    const laboratorio = new Laboratorio(lab);

    assert.equal(laboratorio.tieneEquipo('pc i7'), true);
});

test('Reserva calcula duración en horas', () => {
    assert.equal(new Reserva(reserva).duracionHoras(), 2);
});

test('reservas con solapamiento se cruzan', () => {
    const primera = new Reserva(reserva);

    const segunda = new Reserva({
        ...reserva,
        horaInicio: '09:00',
        horaFin: '11:00'
    });

    assert.equal(primera.seCruzaCon(segunda), true);
});

test('reservas contiguas no se cruzan', () => {
    const primera = new Reserva(reserva);

    const segunda = new Reserva({
        ...reserva,
        horaInicio: '10:00',
        horaFin: '11:00'
    });

    assert.equal(primera.seCruzaCon(segunda), false);
});

test('reservas de días o laboratorios distintos no se cruzan', () => {
    const primera = new Reserva(reserva);

    assert.equal(
        primera.seCruzaCon(
            new Reserva({ ...reserva, laboratorioId: 2 })
        ),
        false
    );

    assert.equal(
        primera.seCruzaCon(
            new Reserva({ ...reserva, fecha: '2026-11-21' })
        ),
        false
    );
});

test('reduce: reservas por estado', () => {
    const resultado = reservasPorEstado([
        { estado: 'pendiente' },
        { estado: 'aprobada' },
        { estado: 'aprobada' }
    ]);

    assert.deepEqual(resultado, {
        pendiente: 1,
        aprobada: 2,
        rechazada: 0
    });
});

test('Map: ocupación por laboratorio', () => {
    const mapa = ocupacionPorLaboratorio([
        { laboratorioId: 1, estado: 'aprobada' },
        { laboratorioId: 1, estado: 'rechazada' },
        { laboratorioId: 2, estado: 'aprobada' }
    ]);

    assert.equal(mapa.get('1'), 1);
    assert.equal(mapa.get('2'), 1);
});

test('Set: sedes sin duplicados', () => {
    const resultado = sedesUnicas([
        { sede: 'Lima Sur' },
        { sede: 'Lima Centro' },
        { sede: 'Lima Sur' }
    ]);

    assert.deepEqual(resultado, [
        'Lima Centro',
        'Lima Sur'
    ]);
});

test('spread y sort: ranking sin modificar el original', () => {
    const laboratorios = [
        { id: 1, nombre: 'Lab A' },
        { id: 2, nombre: 'Lab B' }
    ];

    const ranking = rankingLaboratoriosMasReservados(
        laboratorios,
        [
            { laboratorioId: 2 },
            { laboratorioId: 2 },
            { laboratorioId: 1 }
        ]
    );

    assert.equal(ranking[0].id, 2);
    assert.equal(laboratorios[0].id, 1);
});

test('closure y padStart generan códigos consecutivos', () => {
    const siguiente = crearGeneradorCodigoReserva();

    assert.equal(siguiente(), 'RES-0001');
    assert.equal(siguiente(), 'RES-0002');
});
