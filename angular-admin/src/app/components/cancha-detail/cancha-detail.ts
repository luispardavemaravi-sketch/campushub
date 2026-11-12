import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { CanchaService } from '../../services/cancha';
import { Cancha } from '../../models/cancha.model';

@Component({
  selector: 'app-cancha-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './cancha-detail.html',
  styleUrls: ['./cancha-detail.css']
})
export class CanchaDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly canchaService = inject(CanchaService);
  private readonly cdr = inject(ChangeDetectorRef);

  cancha: Cancha | null = null;

  cargando = true;

  async ngOnInit(): Promise<void> {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {

      await this.cargarDetalle(Number(idParam));

    } else {

      this.cargando = false;
    }
  }

  async cargarDetalle(id: number): Promise<void> {

    this.cargando = true;

    try {

      this.cancha = await firstValueFrom(
        this.canchaService.obtenerPorId(id)
      );

    } catch (error) {

      console.error('Error al cargar cancha:', error);

      this.cancha = null;

    } finally {

      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}