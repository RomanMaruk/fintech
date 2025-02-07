import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInstruments(
    provider: string = 'oanda',
    kind: string = 'forex'
  ): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/instruments/v1/instruments`, {
      params: new HttpParams().set('provider', provider).set('kind', kind),
    });
  }

  listProviders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/instruments/v1/providers`);
  }

  listExchanges(provider?: string): Observable<any> {
    let params = new HttpParams();
    if (provider) {
      params = params.set('provider', provider);
    }
    return this.http.get(`${this.baseUrl}/api/instruments/v1/exchanges`, {
      params,
    });
  }
}
