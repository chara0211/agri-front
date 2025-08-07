import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service'; // Importer AuthService

@Component({
  selector: 'app-notification-orders',
  standalone: false,
  
  templateUrl: './notification-orders.component.html',
  styleUrl: './notification-orders.component.scss'
})
export class NotificationOrdersComponent implements OnInit {
  notifications: any[] = [];
  farmerId!: number; // ID du fermier récupéré via AuthService

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService // Injecter AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du fermier connecté via AuthService
    this.farmerId = this.authService.getUserId(); // Obtient l'ID du fermier actuel

    // Charger les notifications
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getOrderNotificationsForFarmer(this.farmerId).subscribe(
      (data) => {
        this.notifications = data; // Assurez-vous que la structure de réponse correspond à ce que vous attendez
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications', error);
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      // Mettre à jour la notification dans la liste
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== notificationId
      );
    });
  }

}
