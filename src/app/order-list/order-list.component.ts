import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';

// Define interfaces
interface Product {
  name: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: number;
  date: string;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: false
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];  // Define orders with the Order type
  filteredOrders: Order[] = [];  // Define filteredOrders with the Order type
  userId: number = 1;  // ID of the logged-in user
  searchQuery: string = '';  // Search query for filtering orders by article
  selectedStatus: string = '';  // Selected status for filtering orders (e.g., 'completed', 'pending')

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(this.userId).subscribe(
      (response) => {
        this.orders = response;
        this.filteredOrders = response;  // Initialize filteredOrders with all orders
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }

  filterOrders(): void {
    let filtered = this.orders;

    // Filter by status if selected
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    // Filter by search query (article name)
    if (this.searchQuery) {
      filtered = filtered.filter(order =>
        order.order_items.some((item: OrderItem) =>  // Define the type for 'item'
          item.product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
    }

    this.filteredOrders = filtered;  // Update filtered orders
  }
  downloadReceipt(order: any): void {
    this.orderService.downloadReceipt(order);
  }
}
