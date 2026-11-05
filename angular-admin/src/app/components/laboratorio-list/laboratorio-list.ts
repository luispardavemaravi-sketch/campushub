import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Laboratorio } from '../../models/laboratorio.model';
import { LaboratorioService } from '../../services/laboratorio';

@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './laboratorio-list.html',
  styleUrls: ['./laboratorio-list.css']
})
export class LaboratorioListComponent implements OnInit {
  private labService = inject(LaboratorioService);

  laboratorios: Laboratorio[] = [];
  laboratoriosFiltrados: Laboratorio[] = [];
  cargando: boolean = true;
  filtroNombre: string = '';
  filtroSede: string = '';

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargando = true;
    this.labService.listar().subscribe({
      next: (data: Laboratorio[]) => {
        this.laboratorios = data;
        this.laboratoriosFiltrados = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar laboratorios:', err);
        this.cargando = false;
      }
    });
  }

  eliminarLaboratorio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este laboratorio?')) {
      this.labService.eliminar(id).subscribe({
        next: () => {
          this.cargarLaboratorios();
        },
        error: (err: any) => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}