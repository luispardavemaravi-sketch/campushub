import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'canchas'
  },
  {
    path: 'canchas',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/cancha-list/cancha-list')
        .then(m => m.CanchaListComponent)
  },
  {
    path: 'canchas/nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/cancha-form/cancha-form')
        .then(m => m.CanchaForm)
  },
  {
    path: 'canchas/:id/editar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/cancha-form/cancha-form')
        .then(m => m.CanchaForm)
  },
  {
    path: 'canchas/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/cancha-detail/cancha-detail')
        .then(m => m.CanchaDetailComponent)
  },
  {
    path: 'reservas',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/reserva-list/reserva-list')
        .then(m => m.ReservaList)
  },
  {
    path: '**',
    redirectTo: 'canchas'
  }
];