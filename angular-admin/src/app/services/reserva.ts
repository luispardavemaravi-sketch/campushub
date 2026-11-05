
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
  Reserva,
  ReservaPayload
} from '../models/reserva.model';

/**
 * CampusHub - Servicio de reservas.
 * Endpoints correspondientes al avance 1.
 */
@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private readonly http = inject(HttpClient);

  private readonly url = `${API_BASE_URL}/reservas`;

  /**
   * GET /reservas
   * Obtiene la lista de reservas.
   */
  listar(): Observable<Reserva[]> {

    return this.http.get<Reserva[]>(
      this.url
    );
  }

  /**
   * GET /reservas?usuarioId=...
   * Obtiene las reservas de un estudiante.
   */
  listarPorUsuario(
    usuarioId: number
  ): Observable<Reserva[]> {

    const params = new HttpParams()
      .set('usuarioId', usuarioId);

    return this.http.get<Reserva[]>(
      this.url,
      { params }
    );
  }

  /**
   * POST /reservas
   * Registra una nueva reserva.
   */
  crear(
    datos: ReservaPayload
  ): Observable<Reserva> {

    return this.http.post<Reserva>(
      this.url,
      datos
    );
  }

  /**
   * DELETE /reservas/:id
   * Cancela una reserva.
   */
  cancelar(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.url}/${id}`
    );
  }
}
