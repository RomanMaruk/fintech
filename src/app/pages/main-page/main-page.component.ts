import { Component } from '@angular/core';
import { SelectCurrencyComponent } from '../../components/select-currency/select-currency.component';
import { InfoCurrencyComponent } from '../../components/info-currency/info-currency.component';
import { ChartingComponent } from '../../components/charting/charting.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [SelectCurrencyComponent, InfoCurrencyComponent, ChartingComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
