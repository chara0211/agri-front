import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products';  // Adjust the API URL to match your backend

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Fetch the list of products
  getProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`  // Use token to authenticate API requests
    });
  
    // Pass the farmer_id (userId) in the query parameters
    return this.http.get<any[]>(`${this.apiUrl}?farmer_id=${this.authService.getUserId()}`, { headers });
  }
  
  

  addProduct(product: any): Observable<any> {
    const farmerId = this.authService.getUserId(); // Get farmer ID
    const productData = {
      ...product,
      farmer_id: farmerId // Attach farmer_id
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });
  
    console.log('Sending product data to API:', productData); // Log payload
    return this.http.post<any>(this.apiUrl, productData, { headers });
  }

  // Update a product
  updateProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });

    return this.http.put<any>(`${this.apiUrl}/${product.id}`, product, { headers });
  }

  
  
  
  // Delete a product by ID
  deleteProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`  // Use token for authentication
    });
    return this.http.delete<any>(`${this.apiUrl}/${product.id}`, { headers });
  }
}
