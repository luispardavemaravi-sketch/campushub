
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { forkJoin } from 'rxjs';

import {
  Reserva,
  ReservaPayload
} from '../../models/reserva.model';

import { Cancha } from '../../models/cancha.model';
import { Usuario } from '../../models/usuario.model';

import { ReservaService } from '../../services/reserva';
import { CanchaService } from '../../services/cancha';

import { EstadoReservaPipe } from '../../pipes/estado-reserva-pipe';

import {
  ResaltarMantenimientoDirective
} from '../../directives/resaltar-mantenimiento';

import { API_BASE_URL } from '../../config/api.config';

interface ReservaVista extends Reserva {
  canchaNombre: string;
  complejoNombre: string;
  canchaEstado: string;
  usuarioNombre: string;
}

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EstadoReservaPipe,
    ResaltarMantenimientoDirective
  ],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.css'
})
export class ReservaList implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly reservaService = inject(ReservaService);
  private readonly canchaService = inject(CanchaService);

  reservas: ReservaVista[] = [];

  canchas: Cancha[] = [];

  clientes: Usuario[] = [];

  cargando = false;
  guardando = false;

  // Solo se bloquean los botones de la reserva actualizada.
  actualizandoIds = new Set<number>();

  // Filtro por estado.
  filtroEstado:
    | 'todos'
    | 'pendiente'
    | 'aprobada'
    | 'rechazada'
    | 'cancelada' = 'todos';

  mostrandoFormulario = false;

  mensaje = '';
  errorCarga = '';
  errorFormulario = '';

  busquedaCliente = '';

  clienteSeleccionado: Usuario | null = null;

  readonly fechaMinima = this.obtenerFechaLocal();

  private readonly horaMinima = '07:30';
  private readonly horaMaxima = '22:00';
  private readonly duracionMinima = 30;

  formulario = this.fb.group(
    {
      canchaId: [
        null as number | null,
        Validators.required
      ],

      usuarioId: [
        null as number | null,
        Validators.required
      ],

      fecha: [
        this.fechaMinima,
        Validators.required
      ],

      horaInicio: [
        '',
        [
          Validators.required,
          this.validarHora.bind(this)
        ]
      ],

      horaFin: [
        '',
        [
          Validators.required,
          this.validarHora.bind(this)
        ]
      ],

      motivo: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150)
        ]
      ]
    },
    {
      validators: [
        this.validarDuracion.bind(this)
      ]
    }
  );

  ngOnInit(): void {
    this.configurarHoraFinAutomatica();
    this.cargarDatos();
  }

  // =====================================================
  // CARGAR RESERVAS, CANCHAS Y CLIENTES
  // =====================================================

  cargarDatos(): void {

    this.cargando = true;
    this.errorCarga = '';

    this.cdr.detectChanges();

    forkJoin({

      reservas: this.reservaService.listar(),

      canchas: this.canchaService.listar(),

      usuarios: this.http.get<Usuario[]>(
        `${API_BASE_URL}/usuarios`
      )

    }).subscribe({

      next: ({ reservas, canchas, usuarios }) => {

        this.canchas = canchas;

        this.clientes = usuarios.filter(
          usuario => usuario.rol === 'cliente'
        );

        this.reservas = reservas
          .map(reserva => this.convertirVista(reserva))
          .sort((a, b) =>
            b.codigo.localeCompare(
              a.codigo,
              undefined,
              { numeric: true }
            )
          );

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error('Error al cargar reservas:', error);

        this.errorCarga =
          'No se pudieron cargar las reservas. Verifica que JSON Server esté ejecutándose.';

        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  // =====================================================
  // FILTRO DE RESERVAS
  // =====================================================

  get reservasFiltradas(): ReservaVista[] {

    if (this.filtroEstado === 'todos') {
      return this.reservas;
    }

    return this.reservas.filter(
      reserva => reserva.estado === this.filtroEstado
    );
  }

  // =====================================================
  // BÚSQUEDA DE CLIENTES
  // =====================================================

  get clientesEncontrados(): Usuario[] {

    const texto = this.normalizarTexto(
      this.busquedaCliente.trim()
    );

    if (!texto || this.clienteSeleccionado) {
      return [];
    }

    return this.clientes
      .filter(cliente => {

        const nombre = this.normalizarTexto(
          cliente.nombre
        );

        const codigo = this.normalizarTexto(
          cliente.codigo
        );

        return (
          nombre.includes(texto) ||
          codigo.includes(texto)
        );
      })
      .slice(0, 8);
  }

  actualizarBusquedaCliente(valor: string): void {

    this.busquedaCliente = valor;

    if (this.clienteSeleccionado) {

      this.clienteSeleccionado = null;

      this.formulario.controls.usuarioId.setValue(null);
    }
  }

  seleccionarCliente(cliente: Usuario): void {

    this.clienteSeleccionado = cliente;

    this.busquedaCliente = '';

    this.formulario.controls.usuarioId.setValue(
      cliente.id
    );

    this.formulario.controls.usuarioId.markAsTouched();
  }

  quitarClienteSeleccionado(): void {

    this.clienteSeleccionado = null;

    this.busquedaCliente = '';

    this.formulario.controls.usuarioId.setValue(null);
  }

  private normalizarTexto(valor: string): string {

    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // =====================================================
  // HORA DE FIN AUTOMÁTICA
  // =====================================================

  private configurarHoraFinAutomatica(): void {

    this.formulario.controls.horaInicio.valueChanges.subscribe(
      horaInicio => {

        if (!horaInicio) {

          this.formulario.controls.horaFin.setValue('');

          return;
        }

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horaInicio)) {
          return;
        }

        const minutosInicio = this.aMinutos(horaInicio);

        const minutosFin =
          minutosInicio + this.duracionMinima;

        const horas = Math.floor(minutosFin / 60);

        const minutos = minutosFin % 60;

        const horaFinAutomatica =
          `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

        this.formulario.controls.horaFin.setValue(
          horaFinAutomatica
        );

        this.formulario.updateValueAndValidity();
      }
    );
  }

  // =====================================================
  // VALIDAR HORARIO DE ATENCIÓN
  // =====================================================

  private validarHora(
    control: AbstractControl
  ): ValidationErrors | null {

    const valor = control.value;

    if (!valor) return null;

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(valor)) {

      return {
        horaInvalida: true
      };
    }

    const minutos = this.aMinutos(valor);

    if (
      minutos < this.aMinutos(this.horaMinima) ||
      minutos > this.aMinutos(this.horaMaxima)
    ) {

      return {
        fueraDeHorario: true
      };
    }

    return null;
  }

  // =====================================================
  // VALIDAR DURACIÓN MÍNIMA
  // =====================================================

  private validarDuracion(
    grupo: AbstractControl
  ): ValidationErrors | null {

    const inicio = grupo.get('horaInicio')?.value;

    const fin = grupo.get('horaFin')?.value;

    if (!inicio || !fin) return null;

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(inicio) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(fin)
    ) {
      return null;
    }

    const diferencia =
      this.aMinutos(fin) - this.aMinutos(inicio);

    if (diferencia < this.duracionMinima) {

      return {
        duracionMinima: true
      };
    }

    return null;
  }

  // =====================================================
  // ABRIR FORMULARIO
  // =====================================================

  abrirFormulario(): void {

    this.mensaje = '';
    this.errorFormulario = '';

    this.clienteSeleccionado = null;
    this.busquedaCliente = '';

    this.formulario.reset({

      canchaId: null,
      usuarioId: null,
      fecha: this.fechaMinima,
      horaInicio: '',
      horaFin: '',
      motivo: ''

    });

    this.mostrandoFormulario = true;
  }

  // =====================================================
  // CERRAR FORMULARIO
  // =====================================================

  cerrarFormulario(): void {

    this.mostrandoFormulario = false;

    this.errorFormulario = '';

    this.clienteSeleccionado = null;

    this.busquedaCliente = '';

    this.formulario.reset({

      canchaId: null,
      usuarioId: null,
      fecha: this.fechaMinima,
      horaInicio: '',
      horaFin: '',
      motivo: ''

    });
  }

  // =====================================================
  // REGISTRAR RESERVA
  // =====================================================

  registrarReserva(): void {

    this.mensaje = '';
    this.errorFormulario = '';

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      this.errorFormulario =
        'Completa correctamente todos los campos.';

      return;
    }

    const valores = this.formulario.getRawValue();

    const canchaId = Number(valores.canchaId);

    const usuarioId = Number(valores.usuarioId);

    const cancha = this.canchas.find(
      item => item.id === canchaId
    );

    if (!cancha) {

      this.errorFormulario =
        'Selecciona una cancha válida.';

      return;
    }

    if (cancha.estado === 'mantenimiento') {

      this.errorFormulario =
        'No puedes reservar una cancha que está en mantenimiento.';

      return;
    }

    const nuevaReservaBase = {

      canchaId,

      usuarioId,

      fecha: valores.fecha!,

      horaInicio: valores.horaInicio!,

      horaFin: valores.horaFin!,

      motivo: valores.motivo!.trim(),

      estado: 'pendiente' as const
    };

    if (this.existeCruce(nuevaReservaBase)) {

      this.errorFormulario =
        'Ya existe una reserva para esa cancha, fecha y horario.';

      return;
    }

    const payload: ReservaPayload = {

      ...nuevaReservaBase,

      codigo: this.generarCodigo(),

      creadoEn: new Date().toISOString()
    };

    this.guardando = true;

    this.reservaService.crear(payload).subscribe({

      next: reservaCreada => {

        this.reservas = [

          this.convertirVista(reservaCreada),

          ...this.reservas

        ].sort((a, b) =>
          b.codigo.localeCompare(
            a.codigo,
            undefined,
            { numeric: true }
          )
        );

        this.guardando = false;

        this.cerrarFormulario();

        this.mensaje =
          `La reserva ${reservaCreada.codigo} se registró correctamente.`;
      },

      error: error => {

        console.error('Error al registrar reserva:', error);

        this.guardando = false;

        this.errorFormulario =
          'No se pudo registrar la reserva. Inténtalo nuevamente.';
      }
    });
  }

  // =====================================================
  // APROBAR / RECHAZAR RESERVA
  // =====================================================

  cambiarEstadoReserva(
    reserva: ReservaVista,
    nuevoEstado: 'aprobada' | 'rechazada'
  ): void {

    if (this.actualizandoIds.has(reserva.id)) return;

    if (reserva.estado !== 'pendiente') return;

    // No se permite aprobar una reserva cuya cancha
    // actualmente se encuentre en mantenimiento.
    if (
      nuevoEstado === 'aprobada' &&
      reserva.canchaEstado === 'mantenimiento'
    ) {

      this.errorCarga =
        'No se puede aprobar esta reserva porque la cancha está en mantenimiento. Recházala o espera a que vuelva a estar disponible.';

      return;
    }

    const accion = nuevoEstado === 'aprobada'
      ? 'aprobar'
      : 'rechazar';

    const confirmar = window.confirm(
      `¿Deseas ${accion} la reserva ${reserva.codigo}?`
    );

    if (!confirmar) return;

    this.actualizandoIds.add(reserva.id);

    this.mensaje = '';
    this.errorCarga = '';

    this.reservaService.cambiarEstado(
      reserva.id,
      nuevoEstado
    ).subscribe({

      next: reservaActualizada => {

        this.reservas = this.reservas.map(item =>
          item.id === reserva.id
            ? this.convertirVista({
                ...item,
                ...reservaActualizada
              })
            : item
        );

        this.actualizandoIds.delete(reserva.id);

        this.mensaje =
          `La reserva ${reserva.codigo} fue ${nuevoEstado} correctamente.`;

        this.cdr.detectChanges();
      },

      error: error => {

        console.error(`Error al ${accion} reserva:`, error);

        this.actualizandoIds.delete(reserva.id);

        this.errorCarga =
          `No se pudo ${accion} la reserva ${reserva.codigo}. Inténtalo nuevamente.`;

        this.cdr.detectChanges();
      }
    });
  }

  // =====================================================
  // CONVERTIR RESERVA A VISTA
  // =====================================================

  private convertirVista(
    reserva: Reserva
  ): ReservaVista {

    const cancha = this.canchas.find(
      item => item.id === reserva.canchaId
    );

    const cliente = this.clientes.find(
      item => item.id === reserva.usuarioId
    );

    return {

      ...reserva,

      canchaNombre:
        cancha?.nombre ?? `Cancha #${reserva.canchaId}`,

      complejoNombre:
        cancha?.complejo ?? 'Complejo no disponible',

      canchaEstado:
        cancha?.estado ?? 'disponible',

      usuarioNombre:
        cliente?.nombre ?? `Cliente #${reserva.usuarioId}`
    };
  }

  // =====================================================
  // COMPROBAR CRUCE DE HORARIOS
  // =====================================================

  private existeCruce(
    nueva: Pick<
      Reserva,
      'canchaId' | 'fecha' | 'horaInicio' | 'horaFin'
    >
  ): boolean {

    const inicioNuevo = this.aMinutos(
      nueva.horaInicio
    );

    const finNuevo = this.aMinutos(
      nueva.horaFin
    );

    return this.reservas.some(reserva => {

      if (
        reserva.canchaId !== nueva.canchaId ||
        reserva.fecha !== nueva.fecha ||
        reserva.estado === 'rechazada' ||
        reserva.estado === 'cancelada'
      ) {
        return false;
      }

      const inicioExistente = this.aMinutos(
        reserva.horaInicio
      );

      const finExistente = this.aMinutos(
        reserva.horaFin
      );

      return (
        inicioNuevo < finExistente &&
        inicioExistente < finNuevo
      );
    });
  }

  // =====================================================
  // GENERAR CÓDIGO DE RESERVA
  // =====================================================

  private generarCodigo(): string {

    const mayor = this.reservas.reduce(
      (maximo, reserva) => {

        const numero = Number(
          reserva.codigo.match(/^RES-(\d+)$/)?.[1] ?? 0
        );

        return Math.max(maximo, numero);
      },
      0
    );

    return `RES-${String(mayor + 1).padStart(4, '0')}`;
  }

  // =====================================================
  // CONVERTIR HORA A MINUTOS
  // =====================================================

  private aMinutos(hora: string): number {

    const [horas, minutos] = hora.split(':').map(Number);

    return horas * 60 + minutos;
  }

  // =====================================================
  // FECHA LOCAL
  // =====================================================

  private obtenerFechaLocal(): string {

    const ahora = new Date();

    const anio = ahora.getFullYear();

    const mes = String(
      ahora.getMonth() + 1
    ).padStart(2, '0');

    const dia = String(
      ahora.getDate()
    ).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  get totalReservas(): number {
    return this.reservas.length;
  }

  get reservasPendientes(): number {

    return this.reservas.filter(
      reserva => reserva.estado === 'pendiente'
    ).length;
  }

  get reservasAprobadas(): number {

    return this.reservas.filter(
      reserva => reserva.estado === 'aprobada'
    ).length;
  }

  // =====================================================
  // CLASE VISUAL DE ESTADO
  // =====================================================

  obtenerClaseEstado(estado: string): string {

    switch (estado) {

      case 'aprobada':
        return 'reservation-approved';

      case 'pendiente':
        return 'reservation-pending';

      case 'rechazada':
        return 'reservation-rejected';

      case 'cancelada':
        return 'reservation-cancelled';

      default:
        return '';
    }
  }

  // =====================================================
// COMPROBAR SI UNA RESERVA PUEDE RESTAURARSE
// =====================================================

puedeRestaurarReserva(reserva: ReservaVista): boolean {

  if (reserva.estado !== 'cancelada') {
    return false;
  }

  const cancha = this.canchas.find(
    item => Number(item.id) === Number(reserva.canchaId)
  );

  if (!cancha || cancha.estado !== 'disponible') {
    return false;
  }

  const fechaHoraInicio = new Date(
    `${reserva.fecha}T${reserva.horaInicio}:00`
  );

  return fechaHoraInicio > new Date();
}

// =====================================================
// RESTAURAR UNA RESERVA CANCELADA
// =====================================================

restaurarReserva(reserva: ReservaVista): void {

  if (!this.puedeRestaurarReserva(reserva)) {
    return;
  }

  const existeCruce = this.reservas.some(otra => {

    if (
      otra.id === reserva.id ||
      otra.canchaId !== reserva.canchaId ||
      otra.fecha !== reserva.fecha ||
      otra.estado === 'cancelada' ||
      otra.estado === 'rechazada'
    ) {
      return false;
    }

    const inicioNueva = this.aMinutos(reserva.horaInicio);
    const finNueva = this.aMinutos(reserva.horaFin);

    const inicioOtra = this.aMinutos(otra.horaInicio);
    const finOtra = this.aMinutos(otra.horaFin);

    return (
      inicioNueva < finOtra &&
      inicioOtra < finNueva
    );
  });

  if (existeCruce) {

    this.errorCarga =
      'No se puede restaurar esta reserva porque el horario ya está ocupado por otra reserva pendiente o aprobada.';

    return;
  }

  const confirmar = window.confirm(
    `¿Deseas restaurar la reserva ${reserva.codigo} y cambiar su estado a aprobada?`
  );

  if (!confirmar) return;

  this.actualizandoIds.add(reserva.id);

  this.errorCarga = '';
  this.mensaje = '';

  this.reservaService.cambiarEstado(
    reserva.id,
    'aprobada',
    {
      restauradaEn: new Date().toISOString(),
      restauradaPor: 'Administrador',
      motivoRestauracion:
        'Reserva restaurada por el administrador después de verificar la disponibilidad de la cancha.'
    }
  ).subscribe({

    next: reservaActualizada => {

      this.reservas = this.reservas.map(item =>
        item.id === reserva.id
          ? this.convertirVista({
              ...item,
              ...reservaActualizada
            })
          : item
      );

      this.actualizandoIds.delete(reserva.id);

      this.mensaje =
        `La reserva ${reserva.codigo} fue restaurada correctamente.`;

      this.cdr.detectChanges();
    },

    error: error => {

      console.error('Error al restaurar reserva:', error);

      this.actualizandoIds.delete(reserva.id);

      this.errorCarga =
        'No se pudo restaurar la reserva. Inténtalo nuevamente.';

      this.cdr.detectChanges();
    }
  });
}
}
