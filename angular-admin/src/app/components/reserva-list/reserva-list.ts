
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Reserva, ReservaPayload } from '../../models/reserva.model';
import { Laboratorio } from '../../models/laboratorio.model';
import { Usuario } from '../../models/usuario.model';

import { ReservaService } from '../../services/reserva';
import { LaboratorioService } from '../../services/laboratorio';

import { EstadoReservaPipe } from '../../pipes/estado-reserva-pipe';
import { ResaltarMantenimientoDirective } from '../../directives/resaltar-mantenimiento';
import { API_BASE_URL } from '../../config/api.config';

interface ReservaVista extends Reserva {
  laboratorioNombre: string;
  laboratorioEstado: string;
  usuarioNombre: string;
}

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [
    CommonModule,
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
  private readonly laboratorioService = inject(LaboratorioService);

  reservas: ReservaVista[] = [];
  laboratorios: Laboratorio[] = [];
  estudiantes: Usuario[] = [];

  cargando = false;
  guardando = false;
  cancelandoId: number | null = null;
  mostrandoFormulario = false;

  mensaje = '';
  errorCarga = '';
  errorFormulario = '';

  busquedaEstudiante = '';
  estudianteSeleccionado: Usuario | null = null;

  readonly fechaMinima = this.obtenerFechaLocal();

  private readonly horaMinima = '07:30';
  private readonly horaMaxima = '22:00';
  private readonly duracionMinima = 30;

  formulario = this.fb.group(
    {
      laboratorioId: [
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
      validators: [this.validarDuracion.bind(this)]
    }
  );

  ngOnInit(): void {
    this.configurarHoraFinAutomatica();

    // Carga automáticamente las reservas al entrar al componente.
    this.cargarDatos();
  }

  // =====================================================
  // CARGAR DATOS AL ENTRAR AL APARTADO DE RESERVAS
  // =====================================================

  cargarDatos(): void {

    this.cargando = true;
    this.errorCarga = '';
    this.cdr.detectChanges();

    forkJoin({
      reservas: this.reservaService.listar(),
      laboratorios: this.laboratorioService.listar(),
      usuarios: this.http.get<Usuario[]>(
        `${API_BASE_URL}/usuarios`
      )
    }).subscribe({

      next: ({ reservas, laboratorios, usuarios }) => {

        this.laboratorios = laboratorios;

        this.estudiantes = usuarios.filter(
          usuario => usuario.rol === 'estudiante'
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
          'No se pudieron cargar las reservas. Verifica que el API esté ejecutándose.';

        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // =====================================================
  // BÚSQUEDA DE ESTUDIANTES POR NOMBRE O CÓDIGO
  // =====================================================

  get estudiantesEncontrados(): Usuario[] {

    const texto = this.normalizarTexto(
      this.busquedaEstudiante.trim()
    );

    if (!texto || this.estudianteSeleccionado) {
      return [];
    }

    return this.estudiantes
      .filter(estudiante => {

        const nombre = this.normalizarTexto(
          estudiante.nombre
        );

        const codigo = this.normalizarTexto(
          estudiante.codigo
        );

        return nombre.includes(texto) || codigo.includes(texto);
      })
      .slice(0, 8);
  }

  actualizarBusquedaEstudiante(valor: string): void {

    this.busquedaEstudiante = valor;

    if (this.estudianteSeleccionado) {
      this.estudianteSeleccionado = null;
      this.formulario.controls.usuarioId.setValue(null);
    }
  }

  seleccionarEstudiante(estudiante: Usuario): void {

    this.estudianteSeleccionado = estudiante;
    this.busquedaEstudiante = '';
    this.formulario.controls.usuarioId.setValue(estudiante.id);
    this.formulario.controls.usuarioId.markAsTouched();
  }

  quitarEstudianteSeleccionado(): void {

    this.estudianteSeleccionado = null;
    this.busquedaEstudiante = '';
    this.formulario.controls.usuarioId.setValue(null);
  }

  private normalizarTexto(valor: string): string {

    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // =====================================================
  // HORA DE FIN AUTOMÁTICA: 30 MINUTOS DESPUÉS
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
        const minutosFin = minutosInicio + this.duracionMinima;

        const horas = Math.floor(minutosFin / 60);
        const minutos = minutosFin % 60;

        const horaFinAutomatica =
          `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

        this.formulario.controls.horaFin.setValue(
          horaFinAutomatica
        );

        this.formulario.controls.horaFin.markAsTouched();
        this.formulario.updateValueAndValidity();
      }
    );
  }

  // =====================================================
  // VALIDAR HORARIO ENTRE 07:30 Y 22:00
  // =====================================================

  private validarHora(
    control: AbstractControl
  ): ValidationErrors | null {

    const valor = control.value;

    if (!valor) {
      return null;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(valor)) {
      return { horaInvalida: true };
    }

    const minutos = this.aMinutos(valor);

    if (
      minutos < this.aMinutos(this.horaMinima) ||
      minutos > this.aMinutos(this.horaMaxima)
    ) {
      return { fueraDeHorario: true };
    }

    return null;
  }

  // =====================================================
  // VALIDAR DURACIÓN MÍNIMA DE 30 MINUTOS
  // =====================================================

  private validarDuracion(
    grupo: AbstractControl
  ): ValidationErrors | null {

    const inicio = grupo.get('horaInicio')?.value;
    const fin = grupo.get('horaFin')?.value;

    if (!inicio || !fin) {
      return null;
    }

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(inicio) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(fin)
    ) {
      return null;
    }

    const diferencia =
      this.aMinutos(fin) - this.aMinutos(inicio);

    if (diferencia < this.duracionMinima) {
      return { duracionMinima: true };
    }

    return null;
  }

  // =====================================================
  // ABRIR FORMULARIO
  // =====================================================

  abrirFormulario(): void {

    this.mensaje = '';
    this.errorFormulario = '';

    this.estudianteSeleccionado = null;
    this.busquedaEstudiante = '';

    this.formulario.reset({
      laboratorioId: null,
      usuarioId: null,
      fecha: this.fechaMinima,
      horaInicio: '',
      horaFin: '',
      motivo: ''
    });

    this.mostrandoFormulario = true;
  }

  cerrarFormulario(): void {

    this.mostrandoFormulario = false;
    this.errorFormulario = '';

    this.estudianteSeleccionado = null;
    this.busquedaEstudiante = '';

    this.formulario.reset({
      laboratorioId: null,
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

    const laboratorioId = Number(valores.laboratorioId);
    const usuarioId = Number(valores.usuarioId);

    const laboratorio = this.laboratorios.find(
      item => item.id === laboratorioId
    );

    if (!laboratorio) {

      this.errorFormulario =
        'Selecciona un laboratorio válido.';

      return;
    }

    if (laboratorio.estado === 'mantenimiento') {

      this.errorFormulario =
        'No puedes reservar un laboratorio en mantenimiento.';

      return;
    }

    const nuevaReservaBase = {
      laboratorioId,
      usuarioId,
      fecha: valores.fecha!,
      horaInicio: valores.horaInicio!,
      horaFin: valores.horaFin!,
      motivo: valores.motivo!.trim(),
      estado: 'pendiente' as const
    };

    if (this.existeCruce(nuevaReservaBase)) {

      this.errorFormulario =
        'Ya existe una reserva en ese laboratorio y horario.';

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
  // CANCELAR RESERVA
  // =====================================================

  cancelarReserva(reserva: ReservaVista): void {

    if (this.cancelandoId !== null) {
      return;
    }

    const confirmar = window.confirm(
      `¿Deseas cancelar la reserva ${reserva.codigo}?`
    );

    if (!confirmar) {
      return;
    }

    const reservasAnteriores = [...this.reservas];

    // Se elimina visualmente de inmediato.
    this.reservas = this.reservas.filter(
      item => item.id !== reserva.id
    );

    this.cancelandoId = reserva.id;
    this.mensaje = '';
    this.errorCarga = '';

    this.reservaService.cancelar(reserva.id).subscribe({

      next: () => {

        this.cancelandoId = null;

        this.mensaje =
          `La reserva ${reserva.codigo} fue cancelada correctamente.`;
      },

      error: error => {

        console.error('Error al cancelar reserva:', error);

        // Si falla el DELETE, se recupera la reserva.
        this.reservas = reservasAnteriores;
        this.cancelandoId = null;

        this.errorCarga =
          'No se pudo cancelar la reserva. La reserva se ha restaurado en la lista.';
      }
    });
  }

  // =====================================================
  // CONVERTIR RESERVA A VISTA
  // =====================================================

  private convertirVista(reserva: Reserva): ReservaVista {

    const laboratorio = this.laboratorios.find(
      item => item.id === reserva.laboratorioId
    );

    const usuario = this.estudiantes.find(
      item => item.id === reserva.usuarioId
    );

    return {
      ...reserva,

      laboratorioNombre:
        laboratorio?.nombre ?? `Laboratorio #${reserva.laboratorioId}`,

      laboratorioEstado:
        laboratorio?.estado ?? 'disponible',

      usuarioNombre:
        usuario?.nombre ?? `Usuario #${reserva.usuarioId}`
    };
  }

  // =====================================================
  // COMPROBAR CRUCE DE HORARIOS
  // =====================================================

  private existeCruce(
    nueva: Pick<
      Reserva,
      'laboratorioId' | 'fecha' | 'horaInicio' | 'horaFin'
    >
  ): boolean {

    const inicioNuevo = this.aMinutos(nueva.horaInicio);
    const finNuevo = this.aMinutos(nueva.horaFin);

    return this.reservas.some(reserva => {

      if (
        reserva.laboratorioId !== nueva.laboratorioId ||
        reserva.fecha !== nueva.fecha ||
        reserva.estado === 'rechazada'
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
  // GENERAR CÓDIGO AUTOMÁTICO
  // =====================================================

  private generarCodigo(): string {

    const mayor = this.reservas.reduce((maximo, reserva) => {

      const numero = Number(
        reserva.codigo.match(/^RES-(\d+)$/)?.[1] ?? 0
      );

      return Math.max(maximo, numero);

    }, 0);

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
  // OBTENER FECHA LOCAL
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
  // CLASES PARA LOS ESTADOS
  // =====================================================

  obtenerClaseEstado(estado: string): string {

    switch (estado) {

      case 'aprobada':
        return 'bg-success';

      case 'pendiente':
        return 'bg-warning text-dark';

      case 'rechazada':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }
  }
}
