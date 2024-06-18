import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = '';
  constructor() { }

  isAuthenticated() {
    return !!this.token
  }

  getAuthToken() {
    return this.token;
  }

}
