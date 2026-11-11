
import test from 'node:test';
import assert from 'node:assert/strict';

import {
    esCorreoUTP,
    esCodigoCliente,
    esHora,
    esFecha,
    esNombreCancha,
    validarCancha,
    validarReserva
} from './validadores.js';

import {
    Usuario,
    Cancha,
    Reserva
} from './modelos.js';

import {
    reservasPorEstado,
    ocupacionPorCancha,
    complejosUnicos,
    rankingCanchasMasReservadas,
    crearGeneradorCodigoReserva
} from './estadisticas.js';

// =====================================================
// DATOS DE PRUEBA
// =====================================================

const cancha = {
    nombre: 'Cancha Futbol 01',
    complejo: 'Complejo Deportivo Central',
    capacidad: 30,
    implementos: ['Balones', 'Conos', 'Redes'],
    estado: 'disponible'
};

const reserva = {
    canchaId: 1,
    usuarioId: 3,
    fecha: '2026-11-20',
    horaInicio: '08:00',
    horaFin: '10:00',
    motivo: 'Entrenamiento deportivo',
    estado: 'pendiente'
};

// =====================================================
// PRUEBAS DE VALIDADORES
// =====================================================

test('correo institucional UTP: válido e inválido', () => {
    assert.equal(esCorreoUTP('alumno@utp.edu.pe'), true);
    assert.equal(esCorreoUTP('alumno@gmail.com'), false);
});

test('código de cliente: U seguido de ocho dígitos', () => {
    assert.equal(esCodigoCliente('U20231234'), true);
    assert.equal(esCodigoCliente('A20231234'), false);
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

test('nombre de cancha admite caracteres válidos', () => {
    assert.equal(esNombreCancha('Cancha Futbol 01'), true);
    assert.equal(esNombreCancha('!!'), false);
});

test('cancha válida no produce errores', () => {
    assert.deepEqual(validarCancha(cancha), []);
});

test('capacidad debe estar entre 1 y 60 jugadores', () => {
    assert.match(
        validarCancha({ ...cancha, capacidad: 61 }).join(' '),
        /capacidad/
    );

    assert.match(
        validarCancha({ ...cancha, capacidad: 0 }).join(' '),
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

// =====================================================
// PRUEBAS DE MODELOS
// =====================================================

test('Usuario tiene getter de administrador', () => {
    const usuario = new Usuario({
        nombre: 'Ana',
        codigo: 'U00000001',
        rol: 'admin'
    });

    assert.equal(usuario.esAdministrador, true);
});

test('Cancha verifica implementos', () => {
    const nuevaCancha = new Cancha(cancha);

    assert.equal(nuevaCancha.tieneImplemento('balones'), true);
    assert.equal(nuevaCancha.tieneImplemento('raquetas'), false);
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

test('reservas de fechas o canchas distintas no se cruzan', () => {
    const primera = new Reserva(reserva);

    assert.equal(
        primera.seCruzaCon(
            new Reserva({ ...reserva, canchaId: 2 })
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

// =====================================================
// PRUEBAS DE ESTADÍSTICAS
// =====================================================

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

test('Map: ocupación por cancha', () => {
    const mapa = ocupacionPorCancha([
        { canchaId: 1, estado: 'aprobada' },
        { canchaId: 1, estado: 'rechazada' },
        { canchaId: 2, estado: 'aprobada' }
    ]);

    assert.equal(mapa.get('1'), 1);
    assert.equal(mapa.get('2'), 1);
});

test('Set: complejos deportivos sin duplicados', () => {
    const resultado = complejosUnicos([
        { complejo: 'Complejo Norte' },
        { complejo: 'Complejo Sur' },
        { complejo: 'Complejo Norte' }
    ]);

    assert.deepEqual(resultado, [
        'Complejo Norte',
        'Complejo Sur'
    ]);
});

test('spread y sort: ranking sin modificar el original', () => {
    const canchas = [
        { id: 1, nombre: 'Cancha A' },
        { id: 2, nombre: 'Cancha B' }
    ];

    const ranking = rankingCanchasMasReservadas(
        canchas,
        [
            { canchaId: 2 },
            { canchaId: 2 },
            { canchaId: 1 }
        ]
    );

    assert.equal(ranking[0].id, 2);
    assert.equal(ranking[0].totalReservas, 2);
    assert.equal(canchas[0].totalReservas, undefined);
});

test('closure: genera códigos consecutivos', () => {
    const generar = crearGeneradorCodigoReserva();

    assert.equal(generar(), 'RES-0001');
    assert.equal(generar(), 'RES-0002');
    assert.equal(generar(), 'RES-0003');
});

test('generador rechaza un inicio inválido', () => {
    assert.throws(
        () => crearGeneradorCodigoReserva(0),
        RangeError
    );
});
