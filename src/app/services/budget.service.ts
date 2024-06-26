import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';
import { Budget } from 'src/models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    if (!token) {
      throw new Error('No auth token available');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserBudgets() {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/budget`, { headers });
  }

  createOrUpdateBudget(budget: Budget, create: boolean): Observable<any> {
    const headers = this.getAuthHeaders();
    if(create) {
      return this.http.post<any>(`${this.apiUrl}/budget`, budget, { headers }).pipe(
        tap(response => {
          if (response) {
            this.authService._refresh$.next()
          }
        })
      );
    } 
    return this.http.patch<any>(`${this.apiUrl}/budget/${budget.id}`, budget, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );
  }

}
