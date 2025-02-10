import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IListInstrument } from '../models/instrument.interface';

@Injectable({
  providedIn: 'root',
})
export class StateCurrentCurrencyService {
  private currentInstrument = new BehaviorSubject<null | IListInstrument>(null);
  public currentInstrument$ = this.currentInstrument.asObservable();

  set setSelectedCurrency(list: IListInstrument) {
    this.currentInstrument.next(list);
  }
}
