import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    auth.getAccessToken();

    // Está logado → pode entrar
    return true;
  } catch {
    // Não está logado → manda para autenticação
    return router.createUrlTree(['/auth']);
  }
};