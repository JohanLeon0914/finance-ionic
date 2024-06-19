import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Wallet } from 'src/models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private http = inject(HttpClient);
  authService = inject(AuthService);

  constructor() { }

  getUserWallets(): Observable<any> {
    const token = this.authService.getAuthToken();
    if (!token) {
      throw new Error('No auth token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/wallet`, { headers });
  }

  createWallet(wallet: Wallet): Observable<any> {
    const token = this.authService.getAuthToken();
    if (!token) {
      throw new Error('No auth token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    return this.http.post<any>(`${this.apiUrl}/wallet`, wallet, { headers });
  }

}
