import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Credentials } from 'src/models/credentials.model';
import { User } from 'src/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = '';
  private apiUrl = 'http://localhost:3000/api/v1';
  private http = inject(HttpClient)
  _refresh$ = new Subject<void>();

  constructor() { 
    this.token = localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getAuthToken(): string | null {
    return this.token;
  }

  getAuthenticate(credentials: Credentials): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, credentials, { headers }).pipe(
      tap(response => {
        if (response && response.data.token) {
          this.token = response.data.token;
          this._refresh$.next()
          localStorage.setItem('authToken', this.token);
        }
      })
    );
  }

  signUp(user: User): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, user, { headers }).pipe(
      tap(response => {
        if (response.status === 201) {
        }
      })
    );
  }

  logout() {
    this.token = '';
    localStorage.removeItem('authToken');
  }
}
