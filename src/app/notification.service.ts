import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api/notifications'; // Remplacez par l'URL correcte de votre API
  private apiUrlOrders = 'http://localhost:8000/api/orders/notifications';
  private baseUrl = 'http://localhost:8000/api'; // Mettez l'URL de votre API ici

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les notifications
  getNotifications(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // Optionnel : Méthode pour marquer les notifications comme lues
  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-as-read/${notificationId}`, {});
  }

  getOrderNotificationsForFarmer(farmerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlOrders}/${farmerId}`);
  }

  getOrderNotificationsForClient(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/client/${clientId}/order-notifications`);
  }
  
}
