import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service'; // Importer AuthService

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: false,
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  userId!: number; // ID de l'utilisateur, récupéré via AuthService

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private authService: AuthService // Injecter AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté via AuthService
    this.userId = this.authService.getUserId(); 

    // Charger les notifications
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.userId).subscribe(
      (data) => {
        this.notifications = data.unread; // Assurez-vous que cela correspond à votre structure de réponse
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
