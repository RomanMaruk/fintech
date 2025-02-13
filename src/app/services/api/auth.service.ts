import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAuth } from '../../models/auth.interface';
import { milisecondToMinute } from '../../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private subject = new Subject();
  public refreshTokenSubj$ = this.subject.asObservable();

  constructor(private http: HttpClient) {}

  set setToken(token: IAuth) {
    const endTime = milisecondToMinute(new Date().getTime()) + token.expires_in;

    localStorage.setItem('token', token.access_token);
    localStorage.setItem('authResponse', JSON.stringify({ ...token, endTime }));
  }

  get getAuthResponse(): IAuth | null {
    const auth = localStorage.getItem('authResponse');
    if (auth) return JSON.parse(auth);
    return null;
  }

  relogin() {
    this.subject.next('w');
  }

  login(): Observable<IAuth | null> {
    if (this.isLoged()) return of(this.getAuthResponse);

    return this.apiLogin();
  }

  public apiLogin(name?: string, pass?: string): Observable<IAuth> {
    const { username, password } = environment;

    if (name && pass) {
      return this.http.post<IAuth>(
        '/api',
        new HttpParams()
          .set('grant_type', 'password')
          .set('client_id', 'app-cli')
          .set('username', name)
          .set('password', pass),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    }

    return this.http.post<IAuth>(
      '/api',
      new HttpParams()
        .set('grant_type', 'password')
        .set('client_id', 'app-cli')
        .set('username', username)
        .set('password', password),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authResponse');
  }

  public isLoged(): boolean {
    const time = milisecondToMinute(new Date().getTime());
    const authResponse = this.getAuthResponse;
    if (authResponse?.endTime) return time < authResponse?.endTime;
    return false;
  }
}
