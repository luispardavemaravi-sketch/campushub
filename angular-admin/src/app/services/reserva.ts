import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

import {
  Reserva,
  ReservaPayload,
  EstadoReserva
} from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/reservas`;

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url);
  }

  listarPorUsuario(usuarioId: number): Observable<Reserva[]> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.get<Reserva[]>(this.url, { params });
  }

  crear(datos: ReservaPayload): Observable<Reserva> {
    return this.http.post<Reserva>(this.url, datos);
  }

  cambiarEstado(
    id: number,
    estado: EstadoReserva,
    datosAdicionales: Partial<Reserva> = {}
  ): Observable<Reserva> {

    return this.http.patch<Reserva>(
      `${this.url}/${id}`,
      {
        estado,
        ...datosAdicionales
      }
    );
  }

  cancelar(id: number): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.url}/${id}`, {
      estado: 'cancelada',
      motivoEstado: 'Cancelada por el administrador.',
      canceladaEn: new Date().toISOString(),
      canceladaPor: 'Administrador'
    });
  }
}
