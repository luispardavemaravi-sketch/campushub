
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Injectable,
  inject
} from '@angular/core';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import {
  Laboratorio,
  LaboratorioPayload,
  FiltroLaboratorios
} from '../models/laboratorio.model';

/**
 * CampusHub - Servicio de laboratorios.
 *
 * Centraliza las operaciones CRUD del avance 1.
 */
@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  private readonly http = inject(HttpClient);

  private readonly url = `${API_BASE_URL}/laboratorios`;

  /**
   * GET /laboratorios
   * Obtiene los laboratorios registrados.
   * Admite filtros por sede y búsqueda.
   */
  listar(
    filtros: FiltroLaboratorios = {}
  ): Observable<Laboratorio[]> {

    let params = new HttpParams();

    if (filtros.sede?.trim()) {
      params = params.set(
        'sede',
        filtros.sede.trim()
      );
    }

    if (filtros.q?.trim()) {
      params = params.set(
        'q',
        filtros.q.trim()
      );
    }

    return this.http.get<Laboratorio[]>(
      this.url,
      { params }
    );
  }

  /**
   * GET /laboratorios/:id
   * Obtiene un laboratorio por su ID.
   */
  obtenerPorId(
    id: number
  ): Observable<Laboratorio> {

    return this.http.get<Laboratorio>(
      `${this.url}/${id}`
    );
  }

  /**
   * POST /laboratorios
   * Registra un nuevo laboratorio.
   */
  crear(
    datos: LaboratorioPayload
  ): Observable<Laboratorio> {

    return this.http.post<Laboratorio>(
      this.url,
      datos
    );
  }

  /**
   * PUT /laboratorios/:id
   * Actualiza un laboratorio existente.
   */
  actualizar(
    id: number,
    datos: LaboratorioPayload
  ): Observable<Laboratorio> {

    return this.http.put<Laboratorio>(
      `${this.url}/${id}`,
      datos
    );
  }

  /**
   * DELETE /laboratorios/:id
   * Elimina un laboratorio.
   */
  eliminar(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
