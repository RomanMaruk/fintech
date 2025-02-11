import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './api/auth.service';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from './error.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);

  const token = authService.token;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        errorService.unauthorized();
        authService.relogin();
        return next(req);
      }

      authService.logout();
      return throwError(error);
    })
  );
};
