import { NgClass } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LaboratorioService } from '../../services/laboratorio';
import { validarLaboratorio } from '../../../core/validadores';
import { equiposValidator, nombreLaboratorioValidator } from './laboratorio.validators';

// Forma de los datos que se envian al API (el id lo asigna json-server)
interface DatosLaboratorio {
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: 'disponible' | 'mantenimiento';
}

@Component({
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  selector: 'app-laboratorio-form',
  styleUrl: './laboratorio-form.css',
  templateUrl: './laboratorio-form.html',
})
export class LaboratorioForm implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(LaboratorioService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null; // null = modo "nuevo"; con numero = modo "editar"
  guardando = signal(false);
  errorApi = signal('');
  erroresCore = signal<string[]>([]);

  // Formulario reactivo: FormBuilder arma el FormGroup con sus FormControl
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, nombreLaboratorioValidator()]],
    sede: ['', [Validators.required]],
    capacidad: [20, [Validators.required, Validators.min(1), Validators.max(60)]],
    equipos: ['', [equiposValidator()]],
    estado: ['disponible', [Validators.required]],
  });

  ngOnInit() {
    // paramMap se vuelve a emitir si cambia el :id sin recrear el componente
    this.ruta.paramMap.subscribe((params) => {
      const idRuta = params.get('id');
      this.errorApi.set('');
      this.erroresCore.set([]);
      if (!idRuta) {
        this.id = null;
        this.form.reset({ nombre: '', sede: '', capacidad: 20, equipos: '', estado: 'disponible' });
        return;
      }
      this.id = Number(idRuta);
      this.servicio.obtenerPorId(this.id).subscribe({        // patchValue llena el formulario con los datos que ya existen
        // patchValue llena el formulario con los datos que ya existen
        next: (lab) =>
          this.form.patchValue({
            nombre: lab.nombre,
            sede: lab.sede,
            capacidad: lab.capacidad,
            equipos: lab.equipos.join(', '),
            estado: lab.estado,
          }),
        error: () => this.errorApi.set('No se encontró el laboratorio solicitado.'),
      });
    });
  }

  // true si el campo es invalido Y el usuario ya lo toco (para no mostrar errores de entrada)
  invalido(campo: 'nombre' | 'sede' | 'capacidad' | 'equipos') {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: DatosLaboratorio = {
      nombre: v.nombre.trim(),
      sede: v.sede.trim(),
      capacidad: Number(v.capacidad),
      equipos: v.equipos.split(',').map((e) => e.trim()).filter(Boolean),
      estado: v.estado === 'mantenimiento' ? 'mantenimiento' : 'disponible',
    };

    // Segunda validacion con core-js (la misma que usara Express en el avance 5)
    const errores: string[] = validarLaboratorio(datos);
    this.erroresCore.set(errores);
    if (errores.length > 0) return;

    this.guardando.set(true);
    this.errorApi.set('');
    // POST si es nuevo, PUT si estamos editando
    const peticion = this.id ? this.servicio.actualizar(this.id, datos) : this.servicio.crear(datos);
    peticion.subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => {
        this.errorApi.set('No se pudo guardar. Verifica que el API esté encendido (npm run api).');
        this.guardando.set(false);
      },
    });
  }
}
