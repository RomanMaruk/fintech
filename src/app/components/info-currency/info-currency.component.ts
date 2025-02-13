import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { IListInstrument } from '../../models/instrument.interface';
import { BarsService } from '../../services/api/bars.service';
import { StateCurrentCurrencyService } from '../../services/state-current-currency.service';
import { transformDateToYMD } from '../../utils/utils';

@Component({
  selector: 'app-info-currency',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './info-currency.component.html',
  styleUrl: './info-currency.component.scss',
})
export class InfoCurrencyComponent {
  private barsService = inject(BarsService);
  public selectedInstrument$ = inject(
    StateCurrentCurrencyService
  ).currentInstrument$.pipe(shareReplay());

  public infoCurrency$ = this.getCurrencyInfo();

  getCurrencyInfo() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const startDate = transformDateToYMD(date);
    const endDate = transformDateToYMD(new Date());

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
