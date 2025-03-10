import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { IDataRange, IRange } from '../../models/bars.interface';
import { IListInstrument } from '../../models/instrument.interface';
import { BarsService } from '../../services/api/bars.service';
import { StateCurrentCurrencyService } from '../../services/state-current-currency.service';
import { IAsk, WebSocketService } from '../../services/web-socket.service';
import { transformDateToYMD } from '../../utils/utils';

@Component({
  selector: 'app-charting',
  standalone: true,
  imports: [BaseChartDirective, AsyncPipe, NgClass],
  templateUrl: './charting.component.html',
  styleUrl: './charting.component.scss',
})
export class ChartingComponent {
  private wsService = inject(WebSocketService);

  private chart = viewChild(BaseChartDirective);

  public labels: string[] = [];
  public datasChart = [
    {
      data: [] as number[],
      label: 'Series A',
      fill: true,
      tension: 0.5,
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public barChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };

  private barsService = inject(BarsService);
  public stateCurrency$ = inject(StateCurrentCurrencyService)
    .currentInstrument$;

  public barsData$: Observable<IRange[]> = this.stateCurrency$.pipe(
    filter((instrument): instrument is IListInstrument => instrument !== null),
    switchMap((list) => {
      return this.barsService
        .getBarsCountBack({
          periodicity: 'day',
          barsCount: 10,
          provider: 'oanda',
          interval: 1,
          instrumentId: list.id,
        })
        .pipe(
          map((r: IDataRange) => this.updateBarData(r)),
          tap(() => {
            const isConnected = this.wsService.checkWebSocketConnection();
            if (isConnected) {
              this.wsService.subscribeToMarketData(list.id);
            }
          })
        );
    })
  );

  ngOnInit() {
    this.wsService.connect();

    this.wsService.messages$.subscribe((message) => {
      if (message?.ask) {
        this.updateLastDataPoint(message.ask);
      }
    });
  }

  private updateLastDataPoint(data: IAsk) {
    if (this.datasChart[0].data.length > 0) {
      const newArray = [...this.datasChart[0].data];
      newArray[this.datasChart[0].data.length - 1] = data.price;
      this.datasChart[0].data = newArray;
      this.chart()?.update();
    }
  }

  private updateBarData(r: IDataRange) {
    const data = r.data;
    const label: string[] = data.map((d) => transformDateToYMD(d.t));
    const datasChart = data.map((d) => d.c);
    this.datasChart[0].data = datasChart;
    this.labels = label;

    return data;
  }
}
