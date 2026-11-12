import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section
      class="container py-5"
      style="max-width: 480px; min-height: 75vh;"
    >
      <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4 p-md-5">

          <div class="text-center mb-4">
            <div style="font-size: 2.5rem;">🏆</div>
            <h1 class="h3 fw-bold mb-1">SportHub</h1>
            <p class="text-secondary mb-0">
              Ingreso al panel administrativo
            </p>
          </div>

          @if (error) {
            <div class="alert alert-danger">
              {{ error }}
            </div>
          }

          <form
            [formGroup]="formulario"
            (ngSubmit)="ingresar()"
          >
            <div class="mb-3">
              <label for="correo" class="form-label">
                Correo institucional
              </label>

              <input
                id="correo"
                type="email"
                class="form-control"
                formControlName="correo"
                placeholder="usuario@utp.edu.pe"
              >

              @if (
                formulario.controls.correo.touched &&
                formulario.controls.correo.invalid
              ) {
                <small class="text-danger">
                  Ingresa un correo válido.
                </small>
              }
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                class="form-control"
                formControlName="password"
                placeholder="Tu contraseña"
              >

              @if (
                formulario.controls.password.touched &&
                formulario.controls.password.invalid
              ) {
                <small class="text-danger">
                  La contraseña es obligatoria.
                </small>
              }
            </div>

            <button
              class="btn btn-primary w-100"
              type="submit"
              [disabled]="cargando || formulario.invalid"
            >
              {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
            </button>
          </form>

          <p class="small text-secondary text-center mt-4 mb-0">
            Acceso exclusivo para administradores de SportHub.
          </p>

        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  cargando = false;
  error = '';

  formulario = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ingresar(): void {
    if (this.formulario.invalid || this.cargando) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    const { correo, password } = this.formulario.getRawValue();

    this.auth.iniciarSesion(correo, password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigateByUrl('/canchas');
      },
      error: err => {
        this.cargando = false;

        this.error = err?.message?.includes('incorrectos')
          ? err.message
          : 'No se pudo iniciar sesión. Verifica que JSON Server esté activo.';
      }
    });
  }
}