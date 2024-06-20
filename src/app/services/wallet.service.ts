import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';
import { Wallet } from 'src/models/wallet.model';
import { Transaction } from 'src/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private http: HttpClient;
  private authService: AuthService;

  constructor(http: HttpClient, authService: AuthService) {
    this.http = http;
    this.authService = authService;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAuthToken();
    if (!token) {
      throw new Error('No auth token available');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getUserWallets(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/wallet`, { headers });
  }

  createWallet(wallet: Wallet): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/wallet`, wallet, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );
  }

  updateWallet(wallet: Wallet): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`${this.apiUrl}/wallet/${wallet.id}`, 
      { name: wallet.name, description: wallet.description, balance: wallet.balance	}, 
      { headers }).pipe(
        tap(response => {
          if (response) {
            this.authService._refresh$.next()
          }
        })
      );
  }

  deleteWallet(wallet: Wallet): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/wallet/${wallet.id}`, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );
  }

  // TRANSACTIONS

  getUserTransactions(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/transaction`, { headers });
  }

  createTransaction(transaction: Transaction): Observable<any> {
    const headers = this.getAuthHeaders();
    this.authService._refresh$.next()
    return this.http.post<any>(`${this.apiUrl}/transaction`, transaction, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );
  }

  updateTransaction(transaction: Transaction): Observable<any> {
    const headers = this.getAuthHeaders();
    this.authService._refresh$.next()
    return this.http.patch<any>(`${this.apiUrl}/transaction`, transaction, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );
  }

  deleteTransaction(transaction: Transaction): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/transaction/${transaction.id}`, { headers }).pipe(
      tap(response => {
        if (response) {
          this.authService._refresh$.next()
        }
      })
    );;
  }


  getTransactionCategories(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/category`, { headers });
  }
}