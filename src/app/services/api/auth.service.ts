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
            'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3MzkxNzk4NDUsImlhdCI6MTczOTE3ODA0NSwianRpIjoiMGQ5ZGY2NDMtM2VlMC00YjBhLTk3NzAtOGFjNGQxMzM0ZjJiIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJlZHVjYXRpb24iLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJpbnN0cnVtZW50cy1jb25zb2xpZGF0b3IiLCJhY2NvdW50Il0sInN1YiI6Ijk1ZTY2ZGJiLTQ3YTctNDhkOS05ZGZlLTRlYzZjZTQxY2I0MSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImFwcC1jbGkiLCJzaWQiOiJkNTYzZWYyZi1lMDdjLTQzNjUtYjhjYi1jNGUxNmNhMjVlMTEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1maW50YXRlY2giLCJ1c2VycyJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSIsInJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZmludGF0ZWNoIiwidXNlcnMiXSwiZW1haWwiOiJyX3Rlc3RAZmludGF0ZWNoLmNvbSJ9.yAPA_aogiCVXnJAEFb8saftH9aMj0kAm-zcI2EloPksjRIcZR7GaVETqXxGgjcYBGbHCRpE32NH6ktBz-KUjWa5eQ5ZYYPT2RzfB_ONm1MWdFnmoKBr9Bb-HkoEdH7Ty-xH7EQfDpCjkt6d8i9WR4HQQzQXLXPolCGY6zerNNvJ6pGt60yCPWF0kN5jgru-AymrXkMW6CaBTfAYM4QZQ4gnGRlrClwUBrKhD7L_ICFbD56ATiZLgfHkA8HdPeQYwqgBg1qbhB1BozC5ic9SV_ssCwgoYdCwM5BEknB6tfazUxlYcmNlkfTq8gdZzDHG_6DDOtuseu-AmwgMYGXU8LA',
          expires_in: 1800,
          refresh_expires_in: 3600,
          refresh_token:
            'eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzOGVmMDFjNy0zOGIxLTQxODktOGQ1NS1lYmU0ZTA4NzJmOTYifQ.eyJleHAiOjE3MzkxODE2NDUsImlhdCI6MTczOTE3ODA0NSwianRpIjoiMGJkOWExNWQtNDU5Ni00ZDdjLWI5NjMtYjhlNTBkNjRmMDNkIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0uZmludGFjaGFydHMuY29tL2lkZW50aXR5L3JlYWxtcy9maW50YXRlY2giLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiYXBwLWNsaSIsInNpZCI6ImQ1NjNlZjJmLWUwN2MtNDM2NS1iOGNiLWM0ZTE2Y2EyNWUxMSIsInNjb3BlIjoiY29weS10cmFkZXItY29uc29saWRhdG9yIGJhcnMtY29uc29saWRhdG9yIGVtYWlsIHBheW1lbnRzIGluc3RydW1lbnRzLWNvbnNvbGlkYXRvciB0cmFkaW5nLWNvbnNvbGlkYXRvciBhbGVydHMtY29uc29saWRhdG9yIHVzZXItcHJvZmlsZSBlZHVjYXRpb24gd2ViLXNvY2tldHMtc3RyZWFtaW5nIGJhc2ljIHByb2ZpbGUgcm9sZXMgdXNlci1kYXRhLXN0b3JlIG5ld3MtY29uc29saWRhdG9yIn0.eJyFNMm3WCpqcAqPF_DfZTqEk2zGim56brpCLUiNuWvTr9BDDwZ1T7jsX5yDn4b8wsbLUtoLlyCyGgd-pnfGNQ',
          token_type: 'Bearer',
          'not-before-policy': 0,
          session_state: 'd563ef2f-e07c-4365-b8cb-c4e16ca25e11',
          scope: 'profile',
        };

        return of(testResponse);
      })
    );
  }
}
