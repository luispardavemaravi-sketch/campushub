import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LaboratorioService } from '../../services/laboratorio';
import { Laboratorio } from '../../models/laboratorio.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-laboratorio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './laboratorio-detail.html',
  styleUrls: ['./laboratorio-detail.css']
})
export class LaboratorioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private labService = inject(LaboratorioService);
  private cdr = inject(ChangeDetectorRef); // 👈 Inyectamos el detector de cambios

  laboratorio: Laboratorio | null = null;
  cargando: boolean = true;

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      await this.cargarDetalle(id);
    } else {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async cargarDetalle(id: number): Promise<void> {
    this.cargando = true;
    try {
      const data = await firstValueFrom(this.labService.obtenerPorId(id));
      this.laboratorio = data;
    } catch (err) {
      console.error('Error al cargar el detalle:', err);
      this.laboratorio = null;
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // 👈 Forzamos a Angular a repintar la pantalla al terminar
    }
  }
}