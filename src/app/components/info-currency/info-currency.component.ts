import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { BarsService } from '../../services/api/bars.service';

@Component({
  selector: 'app-info-currency',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  providers: [DatePipe],
  templateUrl: './info-currency.component.html',
  styleUrl: './info-currency.component.scss',
})
export class InfoCurrencyComponent {
  private barsService = inject(BarsService);
  private datePipe = inject(DatePipe);

  public infoCurrency$ = this.getCurrencyInfo();

  getCurrencyInfo() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const startDate = this.datePipe.transform(date, 'yyyy-MM-dd') as string;
    const endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;

    return this.barsService
      .getDateRangeBars({
        periodicity: 'day',
        startDate,
        endDate,
        instrumentId: 'ad9e5345-4c3b-41fc-9437-1d253f62db52',
        interval: 1,
        provider: 'simulation',
      })
      .pipe(
        map((res) => {
          const response = res.data[0];
          return {
            price: response.l,
            date: response.t,
          };
        }),
        shareReplay()
      );
  }
}
