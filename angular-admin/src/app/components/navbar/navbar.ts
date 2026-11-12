import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}