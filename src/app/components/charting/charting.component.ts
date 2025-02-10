import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Observable, filter, map, switchMap } from 'rxjs';
import { IDataRange, IRange } from '../../models/bars.interface';
import { IListInstrument } from '../../models/instrument.interface';
import { BarsService } from '../../services/api/bars.service';
import { StateCurrentCurrencyService } from '../../services/state-current-currency.service';
import { IAsk, WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-charting',
  standalone: true,
  imports: [BaseChartDirective, AsyncPipe],
  templateUrl: './charting.component.html',
  styleUrl: './charting.component.scss',
})
export class ChartingComponent {
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
          map((r: IDataRange) => {
            const data = r.data;
            const label = data.map((d) =>
              new DatePipe('en-US').transform(d.t, 'yyyy-MM-dd')
            ) as string[];
            const datasChart = data.map((d) => d.c);
            this.datasChart[0].data = datasChart;
            this.labels = label;

            return data;
          })
        );
    })
  );

  private wsService = inject(WebSocketService);

  ngOnInit() {
    this.wsService.connect();
    this.stateCurrency$.subscribe((res) => {
      if (res) {
        this.wsService.subscribeToMarketData(res.id);
      }
    });

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
}
