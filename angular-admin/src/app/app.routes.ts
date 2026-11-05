import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'laboratorios'
  },
  {
    path: 'laboratorios',
    loadComponent: () =>
      import('./components/laboratorio-list/laboratorio-list')
        .then(m => m.LaboratorioListComponent)
  },
  {
    path: 'laboratorios/nuevo',
    loadComponent: () =>
      import('./components/laboratorio-form/laboratorio-form')
        .then(m => m.LaboratorioForm)
  },
  {
    path: 'laboratorios/:id/editar',
    loadComponent: () =>
      import('./components/laboratorio-form/laboratorio-form')
        .then(m => m.LaboratorioForm)
  },
  {
    path: 'laboratorios/:id',
    loadComponent: () =>
      import('./components/laboratorio-detail/laboratorio-detail')
        .then(m => m.LaboratorioDetailComponent)
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./components/reserva-list/reserva-list')
        .then(m => m.ReservaList)
  },
  {
    path: '**',
    redirectTo: 'laboratorios'
  }
];