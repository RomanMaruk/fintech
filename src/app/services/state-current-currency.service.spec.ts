import { TestBed } from '@angular/core/testing';

import { StateCurrentCurrencyService } from './state-current-currency.service';

describe('StateCurrentCurrencyService', () => {
  let service: StateCurrentCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateCurrentCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
