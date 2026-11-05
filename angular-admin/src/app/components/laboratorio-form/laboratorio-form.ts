import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LaboratorioInput } from '../../models/interfaces';
import { LaboratorioService } from '../../services/laboratorio';
import { nombreLaboratorioValidator } from '../../validators/regex.validator';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-laboratorio-form',
  styleUrl: './laboratorio-form.css',
  templateUrl: './laboratorio-form.html',
})
export class LaboratorioForm implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(LaboratorioService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null; // null = modo "nuevo"
  error = signal('');
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreLaboratorioValidator()]],
    sede: ['', Validators.required],
    capacidad: [20, [Validators.required, Validators.min(1), Validators.max(60)]],
    equipos: [''], // texto separado por comas
    estado: ['disponible', Validators.required],
  });

  ngOnInit() {
    const idRuta = this.ruta.snapshot.paramMap.get('id');
    if (idRuta) {
      this.id = Number(idRuta);
      this.servicio.obtener(this.id).subscribe({
        next: (lab) =>
          this.form.patchValue({ ...lab, equipos: lab.equipos.join(', ') }),
        error: () => this.error.set('No se encontró el laboratorio.'),
      });
    }
  }

  invalido(campo: 'nombre' | 'sede' | 'capacidad') {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const lab: LaboratorioInput = {
      nombre: v.nombre.trim(),
      sede: v.sede.trim(),
      capacidad: Number(v.capacidad),
      equipos: v.equipos.split(',').map((e) => e.trim()).filter(Boolean),
      estado: v.estado === 'mantenimiento' ? 'mantenimiento' : 'disponible',
    };
    this.guardando.set(true);
    const peticion = this.id ? this.servicio.actualizar(this.id, lab) : this.servicio.crear(lab);
    peticion.subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => {
        this.error.set('No se pudo guardar. Revisa que el API esté encendido.');
        this.guardando.set(false);
      },
    });
  }
}
