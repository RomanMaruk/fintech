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
    // this.data
    //   .getBars('ad9e5345-4c3b-41fc-9437-1d253f62db52')
    //   .subscribe((res) => {
    //     console.log(res);
    //   });

    this.bars
      .getTimeBackBars({
        instrumentId: 'c0ea1432-2b7a-40c8-a015-074dbb94d7b6',
        provider: 'oanda',
        interval: 1,
        periodicity: 'minute',
        timeBack: '1.00:00:00',
      })
      .subscribe((bars) => {
        console.log('Bars Time-Back:', bars);
      });
  }
}
