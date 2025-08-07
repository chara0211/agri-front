import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Automatically provides the service at the root level
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Delete a user by ID
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  updateVipStatus(userId: number, isRegular: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/update-vip`, {
      vip_status: isRegular ? 1 : 0,  // Si la commande est régulière, vip_status devient 1
    });
  }
}
