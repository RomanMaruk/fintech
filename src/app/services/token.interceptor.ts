import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './api/auth.service';
import { ErrorService } from './error.service';

const errorCountMap = new Map();

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);

  let token = authService.getAuthResponse?.access_token;

  if (token) {
    req = setAuthorization(req, token);
  }

  const url = req.url;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Increase count errors
        const currentCount = errorCountMap.get(url) || 0;
        if (currentCount >= 1) {
          // If second error than return error
          errorCountMap.delete(url);
          return throwError(() => new Error('401 Unauthorized repeated twice'));
        }

        errorCountMap.set(url, currentCount + 1);

        errorService.unauthorized();

        return authService.apiLogin().pipe(
          switchMap((auth) => {
            token = auth.access_token;
            authService.setToken = auth;
            req = setAuthorization(req, auth.access_token);
            return next(req);
          }),
          catchError((authError) => {
            errorCountMap.delete(url);
            return throwError(() => authError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

const setAuthorization = (
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
