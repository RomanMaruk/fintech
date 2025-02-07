import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  IDataRange,
  IGetBars,
  IGetRangeBars,
  IGetTimeBackBars,
} from '../../models/bars.interface';

@Injectable({
  providedIn: 'root',
})
export class BarsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBars({
    instrumentId,
    provider,
    interval,
    periodicity,
    barsCount,
  }: IGetBars): Observable<IDataRange> {
    return this.http.get<IDataRange>(
      `${this.baseUrl}/api/bars/v1/bars/count-back`,
      {
        params: new HttpParams()
          .set('instrumentId', instrumentId)
          .set('provider', provider)
          .set('interval', interval)
          .set('periodicity', periodicity)
          .set('barsCount', barsCount.toString()),
      }
    );
  }

  getDateRangeBars({
    instrumentId,
    provider,
    interval,
    periodicity,
    startDate,
    endDate,
  }: IGetRangeBars): Observable<IDataRange> {
    let params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', provider)
      .set('interval', interval)
      .set('periodicity', periodicity)
      .set('startDate', startDate);

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<IDataRange>(
      `${this.baseUrl}/api/bars/v1/bars/date-range`,
      {
        params,
      }
    );
  }

  getTimeBackBars({
    instrumentId,
    provider,
    interval,
    periodicity,
    timeBack,
  }: IGetTimeBackBars): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/data-consolidators/bars/v1/bars/time-back`,
      {
        params: new HttpParams()
          .set('instrumentId', instrumentId)
          .set('provider', provider)
          .set('interval', interval)
          .set('periodicity', periodicity)
          .set('timeBack', timeBack),
      }
    );
  }
}
