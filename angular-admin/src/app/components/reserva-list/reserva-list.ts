import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva';
import {EstadoReservaPipe} from '../../pipes/estado-reserva-pipe';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, EstadoReservaPipe],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.css'
})
export class ReservaList implements OnInit {
  private reservaService = inject(ReservaService);
  reservas: any[] = [];

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.listar().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (err) => console.error('Error al cargar reservas:', err)
    });
  }
}