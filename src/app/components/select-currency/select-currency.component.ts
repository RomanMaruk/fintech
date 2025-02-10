import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InstrumentsService } from '../../services/api/instruments.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { IListInstrument } from '../../models/instrument.interface';
import { AsyncPipe } from '@angular/common';
import { StateCurrentCurrencyService } from '../../services/state-current-currency.service';

@Component({
  selector: 'app-select-currency',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './select-currency.component.html',
  styleUrl: './select-currency.component.scss',
})
export class SelectCurrencyComponent implements OnInit, OnDestroy {
  public form = new FormControl<IListInstrument | null>(null);

  private destroy$ = new Subject<void>();

  private instrumentService = inject(InstrumentsService);
  private stateCurrency = inject(StateCurrentCurrencyService);
  public listInsrument$: Observable<IListInstrument[]> = this.instrumentService
    .getInstruments()
    .pipe(
      takeUntil(this.destroy$),
      map((list) => {
        const data = list.data;
        this.form.setValue(data[0]);
        return data;
      })
    );

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((instrument) => {
        if (instrument) this.stateCurrency.setSelectedCurrency = instrument;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
