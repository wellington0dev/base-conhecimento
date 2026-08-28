import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  try {
    const token = auth.getAccessToken();
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }));
  } catch {
    return next(req);
  }
};
