import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Laboratorio } from '../../services/laboratorio';

@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './laboratorio-list.html',
  styleUrl: './laboratorio-list.css'
})
export class LaboratorioListComponent implements OnInit {
  private labService = inject(Laboratorio);
  private cdr = inject(ChangeDetectorRef); // <-- Para forzar la actualización visual

  laboratorios: any[] = [];
  cargando: boolean = true;
  filtroNombre: string = '';
  filtroSede: string = '';

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargando = true;
    this.labService.getLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.cargando = false;
        this.cdr.detectChanges(); // <-- Fuerza a Angular a repintar la vista de inmediato
      },
      error: (err) => {
        console.error('Error al cargar laboratorios:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get laboratoriosFiltrados(): any[] {
    return this.laboratorios.filter(lab => {
      const coincideNombre = lab.nombre ? lab.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true;
      const coincideSede = lab.sede ? lab.sede.toLowerCase().includes(this.filtroSede.toLowerCase()) : true;
      return coincideNombre && coincideSede;
    });
  }

  eliminarLaboratorio(id: number | string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este laboratorio?')) {
      this.labService.deleteLaboratorio(id).subscribe({
        next: () => {
          this.laboratorios = this.laboratorios.filter(lab => lab.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}