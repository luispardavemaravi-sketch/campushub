import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Durante SSR se permite renderizar.
  // La sesión se valida en el navegador.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return auth.estaAutenticado
    ? true
    : router.createUrlTree(['/login']);
};