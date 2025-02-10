import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/api/auth.service';
import { WebSocketService } from './services/web-socket.service';
import { take } from 'rxjs';
import { BarsService } from './services/api/bars.service';
import { InstrumentsService } from './services/api/instruments.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private auth = inject(AuthService);
  private bars = inject(BarsService);
  private instrument = inject(InstrumentsService);
  private wsService = inject(WebSocketService);

  ngOnInit() {
    this.auth
      .login()
      .pipe(take(1))
      .subscribe((r) => {
        this.auth.setToken = r.access_token;
      });

    this.instrument.getInstruments().subscribe((res) => {
      console.log(res);
    });
  }
}
