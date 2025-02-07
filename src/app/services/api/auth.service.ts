import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAuth } from '../../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/identity/realms/:realm/protocol/openid-connect/token`;

  constructor(private http: HttpClient) {}

  set setToken(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token');
  }

  login(): Observable<IAuth> {
    const body = {
      username: environment.username,
      password: environment.password,
    };

    return this.http.post<IAuth>(this.apiUrl, body).pipe(
      catchError((e: HttpErrorResponse) => {
        console.log(e.status);
        const testResponse = {
          access_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3Mzg5NDk4ODgsImlhdCI6MTczODk0ODA4OCwianRpIjoiMGMxOGI4Y2MtOTFmNy00ZjY5LThjMzMtNTI0MWUyZTNhYWY1IiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJlZHVjYXRpb24iLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJpbnN0cnVtZW50cy1jb25zb2xpZGF0b3IiLCJhY2NvdW50Il0sInN1YiI6Ijk1ZTY2ZGJiLTQ3YTctNDhkOS05ZGZlLTRlYzZjZTQxY2I0MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwcC1jbGkiLCJzaWQiOiJlMDBmYjdmYy0yYTIwLTQ2NWMtOGVlZi04Y2JmN2FiYTIxMWUiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1maW50YXRlY2giLCJ1c2VycyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSIsInJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZmludGF0ZWNoIiwidXNlcnMiXSwiZW1haWwiOiJyX3Rlc3RAZmludGF0ZWNoLmNvbSJ9.EbqfddOlweEhb7USuqOn-QwywnGhk7ZlNsT2wps_UjERAbuHUdH28aHlbpDxbuVwp2CIYersQ3WQ1jTeebQzfGLStIU2IS8x4nr6mFQUXuJXyKSlnukR44OuYilobUE_-wwQvfV2fHaxwlwWimXT04eG7CaFEr4AUchvpaHR2xdYtnZN-pUDyjW4WTZO5U773ZYL-VCu6Z_8A3oINAbVymKy4DGx_QOcJL-W8nNJUKSCy9kxnWoQ1n6hCw_FxGpaIQCLMo4kOsHiCBlbz9AnRsFawnn1gCS_KfFWZUmeFkDsn3U8xSXWSg76m11m24_SukifOFkIz5SpOEfWYEkouw',
          expires_in: 1800,
          refresh_expires_in: 3600,
          refresh_token:
            'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOGVmMDFjNy0zOGIxLTQxODktOGQ1NS1lYmU0ZTA4NzJmOTYifQ.eyJleHAiOjE3Mzg5NTE2ODgsImlhdCI6MTczODk0ODA4OCwianRpIjoiM2E2OTllNDItMzM4ZC00YjAxLWE1MTAtY2QyNjQyNTA4NmU4IiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0uZmludGFjaGFydHMuY29tL2lkZW50aXR5L3JlYWxtcy9maW50YXRlY2giLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiYXBwLWNsaSIsInNpZCI6ImUwMGZiN2ZjLTJhMjAtNDY1Yy04ZWVmLThjYmY3YWJhMjExZSIsInNjb3BlIjoiY29weS10cmFkZXItY29uc29saWRhdG9yIGJhcnMtY29uc29saWRhdG9yIGVtYWlsIHBheW1lbnRzIGluc3RydW1lbnRzLWNvbnNvbGlkYXRvciB0cmFkaW5nLWNvbnNvbGlkYXRvciBhbGVydHMtY29uc29saWRhdG9yIHVzZXItcHJvZmlsZSBlZHVjYXRpb24gd2ViLXNvY2tldHMtc3RyZWFtaW5nIGJhc2ljIHByb2ZpbGUgcm9sZXMgdXNlci1kYXRhLXN0b3JlIG5ld3MtY29uc29saWRhdG9yIn0.nZW0T5iaqxtnwraxSSZPDIcz4YFJxLFKnKraj-b_mWOnOj4KJw-uIWyrktw9lAle05tREWj9eP7qn6On1NjmXg',
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'e00fb7fc-2a20-465c-8eef-8cbf7aba211e',
          scope: 'profile',
        };

        return of(testResponse);
      })
    );
  }
}
