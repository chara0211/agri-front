import { Component } from '@angular/core';
import { AuthService } from '../auth.service';   // Si vous devez récupérer l'ID de l'utilisateur connecté


@Component({
  selector: 'app-farmer-sidebar',
  standalone: false,
  
  templateUrl: './farmer-sidebar.component.html',
  styleUrl: './farmer-sidebar.component.scss'
})
export class FarmerSidebarComponent {
  constructor(public authService: AuthService) { }

}
