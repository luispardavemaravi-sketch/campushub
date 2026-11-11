import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { NgClass } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { CanchaService } from '../../services/cancha';
import { ReservaService } from '../../services/reserva';

import {
  Cancha,
  CanchaPayload
} from '../../models/cancha.model';

import { Reserva } from '../../models/reserva.model';

import { validarCancha } from '../../../core/validadores';

import {
  implementosValidator,
  nombreCanchaValidator
} from './cancha.validators';

@Component({
  selector: 'app-cancha-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  styleUrl: './cancha-form.css',
  templateUrl: './cancha-form.html'
})
export class CanchaForm implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(CanchaService);
  private readonly reservaService = inject(ReservaService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id: number | null = null;

  guardando = signal(false);
  cargando = signal(false);

  errorApi = signal('');
  erroresCore = signal<string[]>([]);

  formulario = this.fb.nonNullable.group({

    nombre: [
      '',
      [
        Validators.required,
        nombreCanchaValidator()
      ]
    ],

    complejo: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80)
      ]
    ],

    capacidad: [
      20,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(60)
      ]
    ],

    implementos: [
      '',
      [implementosValidator()]
    ],

    estado: [
      'disponible',
      Validators.required
    ]

  });

  ngOnInit(): void {

    this.ruta.paramMap.subscribe(params => {

      const idRuta = params.get('id');

      this.errorApi.set('');
      this.erroresCore.set([]);

      if (!idRuta) {

        this.id = null;

        this.formulario.reset({
          nombre: '',
          complejo: '',
          capacidad: 20,
          implementos: '',
          estado: 'disponible'
        });

        return;
      }

      this.id = Number(idRuta);
      this.cargando.set(true);

      this.servicio.obtenerPorId(this.id).subscribe({

        next: cancha => {

          this.formulario.patchValue({
            nombre: cancha.nombre,
            complejo: cancha.complejo,
            capacidad: cancha.capacidad,
            implementos: cancha.implementos.join(', '),
            estado: cancha.estado
          });

          this.cargando.set(false);
        },

        error: error => {

          console.error('Error al obtener cancha:', error);

          this.errorApi.set(
            'No se encontró la cancha solicitada.'
          );

          this.cargando.set(false);
        }

      });

    });

  }

  // VALIDAR CAMPOS

  invalido(
    campo: 'nombre' | 'complejo' | 'capacidad' | 'implementos'
  ): boolean {

    const control = this.formulario.controls[campo];

    return control.invalid &&
      (control.touched || control.dirty);
  }

  // NORMALIZAR TEXTO

  private normalizarTexto(valor: string): string {

    return valor
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  }

  // COMPROBAR CANCHAS DUPLICADAS

  private existeCanchaDuplicada(
    canchas: Cancha[],
    nombre: string,
    complejo: string
  ): boolean {

    const nombreNormalizado =
      this.normalizarTexto(nombre);

    const complejoNormalizado =
      this.normalizarTexto(complejo);

    return canchas.some(cancha => {

      if (this.id !== null && Number(cancha.id) === this.id) {
        return false;
      }

      const mismoNombre =
        this.normalizarTexto(cancha.nombre) === nombreNormalizado;

      const mismoComplejo =
        this.normalizarTexto(cancha.complejo) === complejoNormalizado;

      return mismoNombre && mismoComplejo;
    });
  }

  // CANCELAR RESERVAS APROBADAS POR MANTENIMIENTO

  private async cancelarReservasAprobadasPorMantenimiento(
    canchaId: number,
    nombreCancha: string
  ): Promise<void> {

    const reservas: Reserva[] = await firstValueFrom(
      this.reservaService.listar()
    );

    const ahora = new Date();

    const reservasAprobadas = reservas.filter(reserva => {

      const fechaHoraInicio = new Date(
        `${reserva.fecha}T${reserva.horaInicio}:00`
      );

      return (
        Number(reserva.canchaId) === Number(canchaId) &&
        reserva.estado === 'aprobada' &&
        fechaHoraInicio > ahora
      );
    });

    const fechaCancelacion = ahora.toISOString();

    await Promise.all(
      reservasAprobadas.map(reserva =>
        firstValueFrom(
          this.reservaService.cambiarEstado(
            reserva.id,
            'cancelada',
            {
              motivoEstado:
                `Cancelada por mantenimiento de la cancha "${nombreCancha}".`,

              canceladaEn: fechaCancelacion,

              canceladaPor: 'Administrador'
            }
          )
        )
      )
    );
  }

  // GUARDAR CANCHA

  guardar(): void {

    this.errorApi.set('');
    this.erroresCore.set([]);

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;
    }

    const valores = this.formulario.getRawValue();

    const datos: CanchaPayload = {

      nombre: valores.nombre.trim(),

      complejo: valores.complejo.trim(),

      capacidad: Number(valores.capacidad),

      implementos: valores.implementos
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),

      estado:
        valores.estado === 'mantenimiento'
          ? 'mantenimiento'
          : 'disponible'

    };

    const errores = validarCancha(datos);

    this.erroresCore.set(errores);

    if (errores.length > 0) return;

    this.guardando.set(true);

    this.servicio.listar().subscribe({

      next: canchas => {

        const duplicada = this.existeCanchaDuplicada(
          canchas,
          datos.nombre,
          datos.complejo
        );

        if (duplicada) {

          this.errorApi.set(
            `Ya existe una cancha llamada "${datos.nombre}" en el complejo "${datos.complejo}". Utiliza otro nombre o selecciona otro complejo.`
          );

          this.guardando.set(false);

          return;
        }

        const peticion = this.id !== null
          ? this.servicio.actualizar(this.id, datos)
          : this.servicio.crear(datos);

        peticion.subscribe({

          next: async () => {

            if (
              datos.estado === 'mantenimiento' &&
              this.id !== null
            ) {

              try {

                await this.cancelarReservasAprobadasPorMantenimiento(
                  this.id,
                  datos.nombre
                );

              } catch (error) {

                console.error(
                  'La cancha se actualizó, pero no se pudieron actualizar todas las reservas:',
                  error
                );

                this.errorApi.set(
                  'La cancha se actualizó a mantenimiento, pero hubo un problema al actualizar algunas reservas. Vuelve a revisar la gestión de reservas.'
                );

                this.guardando.set(false);

                return;
              }
            }

            this.guardando.set(false);

            this.router.navigate(['/canchas']);

          },

          error: error => {

            console.error('Error al guardar cancha:', error);

            this.errorApi.set(
              'No se pudo guardar la cancha. Verifica que JSON Server esté encendido.'
            );

            this.guardando.set(false);

          }

        });

      },

      error: error => {

        console.error('Error al comprobar canchas existentes:', error);

        this.errorApi.set(
          'No se pudo comprobar si el nombre de la cancha está disponible. Inténtalo nuevamente.'
        );

        this.guardando.set(false);

      }

    });

  }

}