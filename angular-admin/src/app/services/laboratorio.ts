import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Laboratorio {
  private http = inject(HttpClient);
  // URL de tu json-server
  private apiUrl = 'http://localhost:3000/laboratorios';

  // Obtener todos
  getLaboratorios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener uno solo por ID (¡Este es el clave para el detalle!)
  getLaboratorioById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Eliminar
  deleteLaboratorio(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Crear (para el formulario de nuevo laboratorio)
  createLaboratorio(laboratorio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, laboratorio);
  }

  // Actualizar (para el formulario de edición)
  updateLaboratorio(id: string | number, laboratorio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, laboratorio);
  }
}