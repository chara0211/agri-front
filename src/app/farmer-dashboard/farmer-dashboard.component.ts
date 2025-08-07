import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { OrderService } from '../order.service'; // Import the OrderService
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';


interface Product {
  id?: number; // Optional id field
  name: string;
  sales: number;
  revenue: number;
  price: number;  // Include price
  stock: number;  // Include stock
  description: string;  // Add description
  image: string | null;  // Add image
  userId?: number;  // Optional field to store user ID who is adding the product
  status: 'Available' | 'Low Stock' | 'Out of Stock'; // Use union type for stricter control

}

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
  standalone: false  // Explicitly set standalone: false
})
export class FarmerDashboardComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = []; // Filtered list for display
  searchTerm: string = ''; // Search term input by the user
  orders: any[] = []; // Store the farmer's orders
  farmerStats: any[] = [];

  newProduct: Product = {
    name: '',
    sales: 0,
    revenue: 0,
    status: 'Available',
    price: 0,
    stock: 0,
    description: '',
    image: null
  };
  isModalOpen: boolean = false; // Track modal visibility
  selectedProduct: Product = {
    name: '',
    sales: 0,
    revenue: 0,
    status: 'Available',
    price: 0,
    stock: 0,
    description: '',
    image: null,
  };
  isEditModalOpen = false;

  // Store the logged-in user's id and name
  userId: number = 0;
  userName: string = '';

  // Computed properties
  get totalSales(): number {
    return this.products.reduce((total, product) => total + product.sales, 0);
  }

  get totalRevenue(): number {
    return this.products.reduce((total, product) => total + product.revenue, 0);
  }

  get totalOrders(): number {
    return this.orders.length; // Calculate total orders
  }

  get totalProducts(): number {
    return this.products.length;
  }

  constructor(
    private productService: ProductService,
    private orderService: OrderService, // Inject OrderService
    private authService: AuthService,
    private http: HttpClient  // Inject HttpClient here

  ) {}

  ngOnInit() {
    // Retrieve user details from AuthService
    this.userId = this.authService.getUserId();  // Get logged-in user ID
    this.userName = this.authService.getUserName();  // Get logged-in user name
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      this.products = JSON.parse(savedProducts); // Use saved products if available
    }
    // Load products and orders on dashboard load
    this.loadDashboardData();
    this.loadOrders(); // Load orders for the farmer
    this.getFarmerStats(); // Fetch farmer statistics

  }

  loadDashboardData() {
    this.productService.getProducts().subscribe((products: any[]) => {
      console.log(products);  // Log to check the structure and content of products
      localStorage.setItem('products', JSON.stringify(products));  
      this.products = products.map(product => {
        product.revenue = isNaN(parseFloat(product.revenue)) ? 0 : parseFloat(product.revenue);
        product.price = isNaN(parseFloat(product.price)) ? 0 : parseFloat(product.price);
        return product;
      });
      this.filteredProducts = [...this.products];
    });
  }
  
  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product => 
      (typeof product.name === 'string' && product.name.toLowerCase().includes(term)) || 
      (typeof product.description === 'string' && product.description.toLowerCase().includes(term))
    );
  }
  
  

  



  loadOrders() {
    this.orderService.getOrdersForFarmer(this.userId).subscribe(
      (response: any[]) => {
        this.orders = response; // Store the farmer's orders
      },
      (error) => {
        console.error('Error fetching orders for farmer:', error);
      }
    );
  }

  isValidPrice(price: any): boolean {
    return !isNaN(price) && price !== null && price !== '';
  }

  openAddProductModal() {
    this.newProduct = {
      name: '',
      sales: 0,
      revenue: 0,
      status: 'Available',
      price: 0,
      stock: 0,
      description: '',
      image: null,
    };
    this.isModalOpen = true;

    const modal = document.querySelector('.modal') as HTMLElement;
    if (modal) {
      modal.style.display = 'block'; // Show modal
    }
  }

  closeAddProductModal() {
    const modal = document.querySelector('.modal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none'; // Hide modal
    }
  }

  addProduct() {
    if (this.newProduct.name && this.isValidPrice(this.newProduct.price) && this.newProduct.stock >= 0) {
      this.newProduct.userId = this.userId; // Attach user ID
      if (this.newProduct.image) {
        this.newProduct.image = this.newProduct.image.split(',')[1]; // Extract base64 string without metadata
      }
      this.productService.addProduct(this.newProduct).subscribe({
        next: (response) => {
          this.products.push(response.product);  // Update the list
          alert('Product added successfully!');
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Failed to add product.');
        },
      });
    } else {
      alert('Please provide valid product data.');
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.image = reader.result as string; // Convert file to base64
      };
      reader.readAsDataURL(file);
    }
  }

  editProduct(product: Product) {
    console.log('Editing product:', product);
  }

  deleteProduct(product: Product) {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.productService.deleteProduct(product).subscribe({
        next: () => {
          this.products = this.products.filter(p => p !== product); // Remove deleted product from the list
          alert('Product deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete product.');
        }
      });
    }
  }

  openEditProductModal(product: Product) {
    this.selectedProduct = { ...product };
    this.isEditModalOpen = true;
  }

  closeEditProductModal() {
    this.isEditModalOpen = false;
  }

  saveEditedProduct() {
    if (this.selectedProduct.id) {
      if (this.selectedProduct.image) {
        this.selectedProduct.image = this.selectedProduct.image.split(',')[1]; // Extract base64 string without metadata
      }
      this.productService.updateProduct(this.selectedProduct).subscribe({
        next: (response) => {
          const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
          if (index !== -1) {
            this.products[index] = response.product;
            this.closeEditProductModal();
            alert('Product updated successfully!');
          }
        },
        error: () => {
          alert('Failed to update product.');
        }
      });
    }
  }

  onFileSelectedForEdit(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProduct.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  getFarmerStats(): void {
    this.http.get<any[]>('http://localhost:8000/api/farmer-stats').subscribe(
      (data) => {
        this.farmerStats = data;
      },
      (error) => {
        console.error('Error fetching farmer statistics:', error);
      }
    );
  }
  
}
