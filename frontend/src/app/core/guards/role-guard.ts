import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../types/user';

export const roleGuard = (...allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    try {
      const user = auth.getUserData();
      if (allowedRoles.includes(user.role)) {
        return true;
      }
    } catch {
      // Sem usuário logado: deixa o loggedGuard cuidar do redirecionamento para /auth.
    }

    return router.createUrlTree(['/articles']);
  };
};
