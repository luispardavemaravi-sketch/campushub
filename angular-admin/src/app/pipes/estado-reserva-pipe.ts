import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoReserva',
  standalone: true
})
export class EstadoReservaPipe implements PipeTransform {
  transform(value: string): string {
    switch (value?.toLowerCase()) {
      case 'aprobada':
        return '<span class="badge bg-success">🟢 Aprobada</span>';
      case 'pendiente':
        return '<span class="badge bg-warning text-dark">🟡 Pendiente</span>';
      case 'rechazada':
        return '<span class="badge bg-danger">🔴 Rechazada</span>';
      default:
        return `<span class="badge bg-secondary">${value || 'Desconocido'}</span>`;
    }
  }
}