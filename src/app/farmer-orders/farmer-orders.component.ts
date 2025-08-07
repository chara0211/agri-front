import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-farmer-orders',
  templateUrl: './farmer-orders.component.html',
  styleUrls: ['./farmer-orders.component.scss'],
  standalone: false,
})
export class FarmerOrdersComponent implements OnInit {
  orders: any[] = [];  // List of orders
  filteredOrders: any[] = [];  // List of orders after applying filters
  farmerId: number = 0;  // Farmer ID
  client: any = null;  // Client information
  successMessage: string = '';  // Success message for validation

  // Filters
  clientNameFilter: string = '';
  statusFilter: string = '';
  regularityFilter: string = '';

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.farmerId = +params['farmer_id'];  // Get farmer ID from URL
      this.loadOrders();  // Load orders
    });
  }

  // Load orders for the farmer
  loadOrders(): void {
    this.orderService.getOrdersForFarmer(this.farmerId).subscribe(
      (response) => {
        this.orders = response;  // Store the fetched orders
        this.orders.forEach(order => {
          // Add 'isRegular' field based on 'is_regular' value
          order.isRegular = order.is_regular === 1;
        });
        this.filteredOrders = [...this.orders];  // Set filtered orders to all orders initially
        if (this.orders.length > 0) {
          // Assume the first order contains client info
          this.client = this.orders[0].user;
        }
      },
      (error) => {
        console.error('Error loading orders', error);
      }
    );
  }

  // Apply filters based on selected criteria
  applyFilters(): void {
    this.filteredOrders = this.orders.filter((order) => {
      const matchesClientName = order.user.name.toLowerCase().includes(this.clientNameFilter.toLowerCase());
      const matchesStatus = this.statusFilter ? order.status.toLowerCase() === this.statusFilter.toLowerCase() : true;
      const matchesRegularity = this.regularityFilter ? order.isRegular.toString() === this.regularityFilter : true;

      return matchesClientName && matchesStatus && matchesRegularity;
    });
  }

  // Validate an order
  validateOrder(orderId: number): void {
    this.orderService.validateOrder(orderId).subscribe(
      (response) => {
        // Update order status after validation
        const updatedOrder = response;
        const index = this.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }

        // Display success message
        this.successMessage = 'Order validated successfully!';
        setTimeout(() => {
          this.successMessage = '';  // Reset message after a few seconds
        }, 3000);
      },
      (error) => {
        console.error('Error validating order', error);
      }
    );
  }
}
