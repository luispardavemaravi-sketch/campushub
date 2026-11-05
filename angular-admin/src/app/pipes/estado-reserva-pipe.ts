import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoReserva',
  standalone: true
})
export class EstadoReservaPipe implements PipeTransform {

  transform(estado: string | null | undefined): string {

    switch (estado?.toLowerCase()) {

      case 'pendiente':
        return '🟡 Pendiente';

      case 'aprobada':
        return '🟢 Aprobada';

      case 'rechazada':
        return '🔴 Rechazada';

      default:
        return '⚪ Desconocido';

    }
  }
}