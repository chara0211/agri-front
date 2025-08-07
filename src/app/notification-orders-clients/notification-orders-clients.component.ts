import { Component, OnInit  } from '@angular/core';
import { NotificationService } from '../notification.service';
import { AuthService } from '../auth.service'; // Importer AuthService
@Component({
  selector: 'app-notification-orders-clients',
  standalone: false,
  
  templateUrl: './notification-orders-clients.component.html',
  styleUrl: './notification-orders-clients.component.scss'
})
export class NotificationOrdersClientsComponent implements OnInit {
  notifications: any[] = [];
  clientId!: number; // ID du client récupéré via AuthService

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService // Injecter AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du client connecté via AuthService
    this.clientId = this.authService.getUserId(); // Obtient l'ID du client actuel

    // Charger les notifications
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getOrderNotificationsForClient(this.clientId).subscribe(
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