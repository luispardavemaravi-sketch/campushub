
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import {
  Cancha,
  CanchaPayload,
  FiltroCanchas
} from '../models/cancha.model';

/**
 * SportHub - Servicio de gestión de canchas.
 *
 * Centraliza las operaciones CRUD mediante HTTP.
 */
@Injectable({
  providedIn: 'root'
})
export class CanchaService {

  private readonly http = inject(HttpClient);

  private readonly url = `${API_BASE_URL}/canchas`;

  /**
   * GET /canchas
   * Lista todas las canchas y permite aplicar filtros.
   */
  listar(
    filtros: FiltroCanchas = {}
  ): Observable<Cancha[]> {

    let params = new HttpParams();

    if (filtros.complejo?.trim()) {
      params = params.set(
        'complejo',
        filtros.complejo.trim()
      );
    }

    if (filtros.q?.trim()) {
      params = params.set(
        'q',
        filtros.q.trim()
      );
    }

    return this.http.get<Cancha[]>(
      this.url,
      { params }
    );
  }

  /**
   * GET /canchas/:id
   */
  obtenerPorId(id: number): Observable<Cancha> {

    return this.http.get<Cancha>(
      `${this.url}/${id}`
    );
  }

  /**
   * POST /canchas
   */
  crear(datos: CanchaPayload): Observable<Cancha> {

    return this.http.post<Cancha>(
      this.url,
      datos
    );
  }

  /**
   * PUT /canchas/:id
   */
  actualizar(
    id: number,
    datos: CanchaPayload
  ): Observable<Cancha> {

    return this.http.put<Cancha>(
      `${this.url}/${id}`,
      datos
    );
  }

  /**
   * DELETE /canchas/:id
   */
  eliminar(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
