import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { IListInstrument } from '../../models/instrument.interface';
import { BarsService } from '../../services/api/bars.service';
import { StateCurrentCurrencyService } from '../../services/state-current-currency.service';

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
  public selectedInstrument$ = inject(
    StateCurrentCurrencyService
  ).currentInstrument$.pipe(shareReplay());

  public infoCurrency$ = this.getCurrencyInfo();

  getCurrencyInfo() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const startDate = this.datePipe.transform(date, 'yyyy-MM-dd') as string;
    const endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') as string;

    return this.selectedInstrument$.pipe(
      filter(
        (instrument): instrument is IListInstrument => instrument !== null
      ),
      switchMap((instrument: IListInstrument) => {
        return this.barsService
          .getDateRangeBars({
            periodicity: 'day',
            startDate,
            endDate,
            instrumentId: instrument.id,
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
      }),
      shareReplay()
    );
  }
}
