import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8000/api/posts'; // Base URL for posts
  private commentsApiUrl = 'http://localhost:8000/api/comments'; // Base URL for comments
  private cartApiUrl = 'http://localhost:8000/api/cart/add'; // URL for adding products to cart
  private apiUrlCart = 'http://localhost:8000/api/cart';  // Remplacez par l'URL de votre API backend
  private apiUrlOrder = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  // Method to fetch all posts with the username who submitted the post
  getPosts(): Observable<any> {
    return this.http.get(this.apiUrl); // Ensure the backend returns 'userName'
  }

  // Method to create a new post
  createPost(postData: any): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  // Method to get comments for a specific post
  // PostService
getCommentsForPost(postId: number): Observable<any> {
  return this.http.get<any[]>(`${this.commentsApiUrl}?post_id=${postId}`).pipe(
    map(comments => {
      return comments.map(comment => ({
        ...comment,
        userName: comment.user?.name || 'Anonymous', // Ensure userName is set from the user object
      }));
    })
  );
}


  // Method to add a comment to a post
  addComment(commentData: any): Observable<any> {
    return this.http.post(this.commentsApiUrl, commentData);
  }

  // Method to update a post without FormData, sending the data as an object
  updatePost(postId: number, postData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, postData); // Sending data as an object
  }

  // Method to delete a post
  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }

  getProductsByUserId(userId: number) {
    const url = `http://localhost:8000/api/products/user/${userId}`;
    return this.http.get<any[]>(url); // Remplacez le type `any[]` par le type de vos produits si nécessaire
  }

  addToCart(cartData: any): Observable<any> {
    return this.http.post(this.cartApiUrl, cartData); // Envoie les données au backend pour ajouter au panier
  }
  
  getCartItems(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlCart}?user_id=${userId}`);
  }
  updateCartItem(item: any): Observable<any> {
    const cartData = {
      user_id: item.user_id,
      product_id: item.product.id,
      quantity: item.quantity
    };
    return this.http.put<any>('http://localhost:8000/api/cart', cartData); // Remplacez par l'URL de votre API backend pour la mise à jour du panier
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrlOrder}/place-order`, orderData);
  }


  //that's what i added for admin post
  // Method to delete a comment
deleteComment(commentId: number): Observable<any> {
  return this.http.delete(`${this.commentsApiUrl}/${commentId}`);
}

  
}
