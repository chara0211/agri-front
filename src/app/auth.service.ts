import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: string | null = null; // Store token (could also be in localStorage/sessionStorage)
  private _user: any = null; // Store user info (id and name)

  private apiUrlRegister = 'http://localhost:8000/api/register';  // URL for registration
  private apiUrlLogin = 'http://localhost:8000/api/login';  // URL for login

  constructor(private http: HttpClient) {}

  // Get token method
  get token(): string | null {
    return this._token;
  }

  // Set token method (you may set it after login)
  setToken(token: string): void {
    this._token = token;
    localStorage.setItem('token', token);  // Store token in localStorage for persistence
  }

  // Get user method
  get user(): any {
    return this._user || JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Set user method
  setUser(user: any): void {
    this._user = user;
    localStorage.setItem('user', JSON.stringify(user));  // Store user info in localStorage for persistence
  }

  // Method for registration
  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrlRegister, userData);
  }

  // Simple login method to send the login request
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(this.apiUrlLogin, credentials);
  }

  // Get user ID
  getUserId(): number {
    return this.user?.id || 0;  // Return user ID if available, otherwise 0
  }

  // Get user name
  getUserName(): string {
    return this.user?.name || '';  // Return user name if available, otherwise an empty string
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.token && !!this.user.id;  // Check if both token and user ID exist
  }

  // Log out method to clear token and user info
  logout(): void {
    this._token = null;
    this._user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
