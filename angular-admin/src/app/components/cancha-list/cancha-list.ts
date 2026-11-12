import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CanchaService } from '../../services/cancha';
import { Cancha } from '../../models/cancha.model';

import {
  ResaltarMantenimientoDirective
} from '../../directives/resaltar-mantenimiento';

@Component({
  selector: 'app-cancha-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ResaltarMantenimientoDirective
  ],
  templateUrl: './cancha-list.html',
  styleUrls: ['./cancha-list.css']
})
export class CanchaListComponent implements OnInit {

  private readonly canchaService = inject(CanchaService);
  private readonly cdr = inject(ChangeDetectorRef);

  canchas: Cancha[] = [];
  canchasFiltradas: Cancha[] = [];

  filtroNombre = '';
  filtroComplejo = '';

  cargando = true;
  errorCarga = '';

  ngOnInit(): void {
    this.cargarCanchas();
  }

  async cargarCanchas(): Promise<void> {

    this.cargando = true;
    this.errorCarga = '';

    try {

      this.canchas = (await firstValueFrom(
        this.canchaService.listar()
      )).sort((a, b) => Number(b.id) - Number(a.id));

      this.filtrar();

    } catch (error) {

      console.error('Error al cargar canchas:', error);

      this.errorCarga =
        'No se pudieron cargar las canchas. Verifica que JSON Server esté funcionando.';

    } finally {

      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  get complejos(): string[] {

    return [
      ...new Set(
        this.canchas.map(cancha => cancha.complejo)
      )
    ].sort();
  }

  get totalCanchas(): number {
    return this.canchas.length;
  }

  get canchasDisponibles(): number {

    return this.canchas.filter(
      cancha => cancha.estado === 'disponible'
    ).length;
  }

  get canchasMantenimiento(): number {

    return this.canchas.filter(
      cancha => cancha.estado === 'mantenimiento'
    ).length;
  }

  filtrar(): void {

    const nombre = this.normalizarTexto(
      this.filtroNombre
    );

    this.canchasFiltradas = this.canchas.filter(cancha => {

      const coincideNombre =
        this.normalizarTexto(cancha.nombre).includes(nombre);

      const coincideComplejo =
        !this.filtroComplejo ||
        cancha.complejo === this.filtroComplejo;

      return coincideNombre && coincideComplejo;
    });
  }

  private normalizarTexto(valor: string): string {

    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  async eliminarCancha(id: number): Promise<void> {

    const cancha = this.canchas.find(
      item => item.id === id
    );

    if (!cancha) return;

    const seguro = window.confirm(
      `¿Estás seguro de eliminar "${cancha.nombre}"?`
    );

    if (!seguro) return;

    try {

      await firstValueFrom(
        this.canchaService.eliminar(id)
      );

      this.canchas = this.canchas.filter(
        item => item.id !== id
      );

      this.filtrar();

      this.cdr.detectChanges();

    } catch (error) {

      console.error('Error al eliminar cancha:', error);

      window.alert(
        'No se pudo eliminar la cancha. Inténtalo nuevamente.'
      );
    }
  }

  obtenerClaseEstado(estado: string): string {

    return estado === 'disponible'
      ? 'status-available'
      : 'status-maintenance';
  }
}