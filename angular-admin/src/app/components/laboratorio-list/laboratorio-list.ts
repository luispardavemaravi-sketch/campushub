import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LaboratorioService } from '../../services/laboratorio';
import { Laboratorio } from '../../models/laboratorio.model';
import { firstValueFrom } from 'rxjs';
import { ResaltarMantenimientoDirective } from '../../directives/resaltar-mantenimiento';

@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ResaltarMantenimientoDirective],
  templateUrl: './laboratorio-list.html',
  styleUrls: ['./laboratorio-list.css']
})
export class LaboratorioListComponent implements OnInit {
  private labService = inject(LaboratorioService);
  private cdr = inject(ChangeDetectorRef);

  laboratorios: Laboratorio[] = [];
  laboratoriosFiltrados: Laboratorio[] = [];

  filtroNombre: string = '';
  filtroSede: string = '';

  cargando: boolean = true;

  async ngOnInit(): Promise<void> {
    await this.cargarLaboratorios();
  }

  async cargarLaboratorios(): Promise<void> {
    try {
      this.laboratorios = await firstValueFrom(this.labService.listar());
      this.laboratoriosFiltrados = [...this.laboratorios];
    } catch (err) {
      console.error('Error al cargar laboratorios:', err);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  filtrar(): void {
    this.laboratoriosFiltrados = this.laboratorios.filter(lab => {
      const coincideNombre = lab.nombre ? lab.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true;
      const coincideSede = lab.sede ? lab.sede.toLowerCase().includes(this.filtroSede.toLowerCase()) : true;
      return coincideNombre && coincideSede;
    });
  }

  async eliminarLaboratorio(id: number): Promise<void> {
    const seguro = confirm('¿Estás seguro de que deseas eliminar este laboratorio?');
    
    if (seguro) {
      try {
        await firstValueFrom(this.labService.eliminar(id));
        // Actualizamos la lista local en vivo sin recargar la página
        this.laboratorios = this.laboratorios.filter(lab => lab.id !== id);
        this.laboratoriosFiltrados = this.laboratoriosFiltrados.filter(lab => lab.id !== id);
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Error al eliminar laboratorio:', err);
        alert('Ocurrió un error al intentar eliminar el laboratorio.');
      }
    }
  }
}