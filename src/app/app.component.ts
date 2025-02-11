import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, filter, startWith, switchMap, tap } from 'rxjs';
import { AuthService } from './services/api/auth.service';
import { IAuth } from './models/auth.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private authService = inject(AuthService);
  public auth$: Observable<IAuth | boolean> =
    this.authService.refreshTokenSubj$.pipe(
      startWith(''),
      switchMap(() => {
        return this.authService.login().pipe(
          filter((auth): auth is IAuth => auth !== null),
          tap((res) => (this.authService.setToken = res))
        );
      })
    );
}
