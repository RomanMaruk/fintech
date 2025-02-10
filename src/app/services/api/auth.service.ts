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
        const testResponse = {
          access_token:
            'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3MzkxODk2OTAsImlhdCI6MTczOTE4Nzg5MCwianRpIjoiYjVjMGMxMGQtMzM4OC00OTg3LWFjODAtNDQxZDhlOWFjZWY4IiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJlZHVjYXRpb24iLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJpbnN0cnVtZW50cy1jb25zb2xpZGF0b3IiLCJhY2NvdW50Il0sInN1YiI6Ijk1ZTY2ZGJiLTQ3YTctNDhkOS05ZGZlLTRlYzZjZTQxY2I0MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwcC1jbGkiLCJzaWQiOiJlMzU0NmMwMS0xNGYxLTQwN2ItYTM1NC02MmI1NzE0ZmQwOTYiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1maW50YXRlY2giLCJ1c2VycyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSIsInJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZmludGF0ZWNoIiwidXNlcnMiXSwiZW1haWwiOiJyX3Rlc3RAZmludGF0ZWNoLmNvbSJ9.X3ncc6Y0V9joqS8hw6ub_eXVrBqJiEGKCLPJeT7PiG2yqPE6ykHnx33CSeJf6hyAspemjgSyeMOTDQk7xyRODK4264H8ZgvmhYeuZxTvC3Qviq84HAsecnyIvsoWNn81rJeDUzcraBBdfyOavCYdCNcytnQZTFzF19RI4kHq54PJGTH96o0AXF8zk-gwsUHYRL0XKvZPM0sq560QDsrBHfc8m94KOSZu2EjDiRC3yaQ9fpW3BdkS55LV50iVwEDlOsQbzLDUP2n_32tqcjFdLVD23nN_3wtbMLA7Cv2fJTq7wLmB2RbQuSD9ryMs4VHrSaoCqU23_m9XMJ7gD1LBcA',
          expires_in: 1800,
          refresh_expires_in: 3600,
          refresh_token:
            'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOGVmMDFjNy0zOGIxLTQxODktOGQ1NS1lYmU0ZTA4NzJmOTYifQ.eyJleHAiOjE3MzkxOTE0OTAsImlhdCI6MTczOTE4Nzg5MCwianRpIjoiYWRkYTJiNDctMDM1MS00ZjM2LWE0YzUtMGIxOGU5ZjQ2Yjk1IiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0uZmludGFjaGFydHMuY29tL2lkZW50aXR5L3JlYWxtcy9maW50YXRlY2giLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiYXBwLWNsaSIsInNpZCI6ImUzNTQ2YzAxLTE0ZjEtNDA3Yi1hMzU0LTYyYjU3MTRmZDA5NiIsInNjb3BlIjoiY29weS10cmFkZXItY29uc29saWRhdG9yIGJhcnMtY29uc29saWRhdG9yIGVtYWlsIHBheW1lbnRzIGluc3RydW1lbnRzLWNvbnNvbGlkYXRvciB0cmFkaW5nLWNvbnNvbGlkYXRvciBhbGVydHMtY29uc29saWRhdG9yIHVzZXItcHJvZmlsZSBlZHVjYXRpb24gd2ViLXNvY2tldHMtc3RyZWFtaW5nIGJhc2ljIHByb2ZpbGUgcm9sZXMgdXNlci1kYXRhLXN0b3JlIG5ld3MtY29uc29saWRhdG9yIn0.aJao5c85kGKMZWrRDOoXpBVlOMgLu-u_lciDUXivlWkYMYEjQEqRg7Vg2gZud8kb2byaeMrBPLHoWLIjO0VoQA',
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'e3546c01-14f1-407b-a354-62b5714fd096',
          scope: 'profile',
        };

        return of(testResponse);
      })
    );
  }
}
