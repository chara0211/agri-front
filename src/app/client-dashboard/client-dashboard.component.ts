import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';  // Import the AuthService

@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  userName: string = '';  // Variable to hold the username

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName();  // Get the logged-in user's name
  }
}
