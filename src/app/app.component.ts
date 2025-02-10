import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from './services/api/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private auth = inject(AuthService);

  ngOnInit() {
    this.auth
      .login()
      .pipe(take(1))
      .subscribe((r) => {
        this.auth.setToken = r.access_token;
      });
  }
}
