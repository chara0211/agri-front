import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-regular-orders',
  templateUrl: './regular-orders.component.html',
  styleUrls: ['./regular-orders.component.scss'],
  standalone: false,
})
export class RegularOrdersComponent implements OnInit {
  orders: any[] = [];
  regularOrders: any[] = [];  // Nouvelle propriété pour les commandes régulières
  farmerId: number = 0;
  client: any = null;
  successMessage: string = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.farmerId = +params['farmer_id'];
      this.loadOrders();  // Charger les commandes
    });
  }

  loadOrders(): void {
    this.orderService.getOrdersForFarmer(this.farmerId).subscribe(
      (response) => {
        this.orders = response;
        // Filtrer les commandes régulières
        this.regularOrders = this.orders.filter(order => order.is_regular === 1);
        
        // Ajouter un champ 'isRegular' basé sur la valeur de 'is_regular'
        this.regularOrders.forEach(order => {
          order.isRegular = order.is_regular === 1;
        });

        if (this.regularOrders.length > 0) {
          this.client = this.regularOrders[0].user;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }

  validateOrder(orderId: number): void {
    this.orderService.validateOrder(orderId).subscribe(
      (response) => {
        const updatedOrder = response;
        const index = this.regularOrders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          this.regularOrders[index] = updatedOrder;
        }

        this.successMessage = 'Commande validée avec succès !';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('Erreur lors de la validation de la commande', error);
      }
    );
  }
}
