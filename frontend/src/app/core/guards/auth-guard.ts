import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    auth.getAccessToken();

    // Já está logado → manda para a aplicação
    return router.createUrlTree(['/articles']);
  } catch {
    // Não está logado → pode acessar o login
    return true;
  }
};