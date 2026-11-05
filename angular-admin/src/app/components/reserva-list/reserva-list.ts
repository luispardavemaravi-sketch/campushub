import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva';
import { EstadoReservaPipe } from '../../pipes/estado-reserva-pipe';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, EstadoReservaPipe],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.css'
})
export class ReservaList implements OnInit {
  private reservaService = inject(ReservaService);
  private cdr = inject(ChangeDetectorRef);
  
  reservas: any[] = [];
  cargando: boolean = true; // Para controlar el estado de carga

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.listar().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.reservas = data;
        } else if (data && Array.isArray(data.body)) {
          this.reservas = data.body;
        } else if (data && Array.isArray(data.data)) {
          this.reservas = data.data;
        } else {
          this.reservas = [];
        }
        this.cargando = false;
        this.cdr.detectChanges(); // Fuerza la actualización de la vista
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.reservas = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}