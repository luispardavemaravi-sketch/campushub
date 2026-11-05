import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Laboratorio } from '../../services/laboratorio';

@Component({
  selector: 'app-laboratorio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './laboratorio-detail.html',
  styleUrl: './laboratorio-detail.css'
})
export class LaboratorioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private labService = inject(Laboratorio);
  private location = inject(Location);

  laboratorio: any = null;
  cargando: boolean = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDetalle(id);
    }
  }

  cargarDetalle(id: string): void {
    this.cargando = true;
    this.labService.getLaboratorioById(id).subscribe({
      next: (data) => {
        this.laboratorio = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener detalle:', err);
        this.cargando = false;
      }
    });
  }

  volver(): void {
    this.location.back();
  }
}