import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly usuarioActual = signal<Omit<Usuario, 'password'> | null>(
    this.leerSesion()
  );

  get estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  iniciarSesion(correo: string, password: string): Observable<Usuario> {
    const params = new HttpParams().set(
      'correo',
      correo.trim().toLowerCase()
    );

    return this.http
      .get<Usuario[]>(`${API_BASE_URL}/usuarios`, { params })
      .pipe(
        map(usuarios => {
          const usuario = usuarios.find(item =>
            item.password === password && item.rol === 'admin'
          );

          if (!usuario) {
            throw new Error(
              'Correo o contraseña incorrectos, o la cuenta no es administradora.'
            );
          }

          return usuario;
        }),
        tap(usuario => {
          const { password: _password, ...usuarioPublico } = usuario;

          this.usuarioActual.set(usuarioPublico);

          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem(
              'sporthub_admin',
              JSON.stringify(usuarioPublico)
            );
          }
        })
      );
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('sporthub_admin');
    }
  }

  private leerSesion(): Omit<Usuario, 'password'> | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const dato = sessionStorage.getItem('sporthub_admin');

      if (!dato) {
        return null;
      }

      const usuario = JSON.parse(dato) as Omit<Usuario, 'password'>;

      return usuario?.rol === 'admin' ? usuario : null;
    } catch {
      return null;
    }
  }
}