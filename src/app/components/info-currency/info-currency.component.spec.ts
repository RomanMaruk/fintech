import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCurrencyComponent } from './info-currency.component';

describe('InfoCurrencyComponent', () => {
  let component: InfoCurrencyComponent;
  let fixture: ComponentFixture<InfoCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
