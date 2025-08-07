import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service'; // Assurez-vous que AuthService est importé pour obtenir l'user_id
import { UserService } from '../user.service'; // Service pour mettre à jour le vip_status

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false,
})
export class CartComponent implements OnInit {
  cartItems: any[] = []; // Tableau pour stocker les éléments du panier
  userId!: number; // ID de l'utilisateur connecté
  isRegular: boolean = false; // Indique si la commande est régulière
  regularityType: string = ''; // Type de régularité
  interval: number = 1; // Intervalle de temps

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService // Injecter le service pour mettre à jour le VIP status
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();  // Récupérer l'ID de l'utilisateur à partir d'AuthService
    this.getCartItems();  // Appeler la méthode pour récupérer les éléments du panier
  }

  // Méthode pour récupérer les éléments du panier
  getCartItems(): void {
    this.postService.getCartItems(this.userId).subscribe(
      (response) => {
        this.cartItems = response;  // Stocker les éléments dans le tableau cartItems
      },
      (error) => {
        console.error('Erreur lors de la récupération du panier:', error);
        alert('Impossible de récupérer les éléments du panier.');
      }
    );
  }

  incrementQuantity(item: any): void {
    item.quantity += 1;
    this.updateCartItem(item); // Mettre à jour l'élément du panier
  }

  // Méthode pour décrémenter la quantité
  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.updateCartItem(item); // Mettre à jour l'élément du panier
    }
  }

  // Méthode pour mettre à jour la quantité de l'élément dans le panier (requête API)
  updateCartItem(item: any): void {
    // Appel API pour mettre à jour la quantité du produit dans le panier
    this.postService.updateCartItem(item).subscribe(
      (response) => {
        console.log('Panier mis à jour', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du panier:', error);
      }
    );
  }

  // Méthode pour obtenir l'URL complète de l'image du produit
  getImageUrl(imagePath: string): string {
    return `http://localhost:8000/storage/${imagePath}`;  // Remplacer par l'URL de votre serveur d'images
  }

  // Méthode pour valider le panier
  validateCart(): void {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    const orderData = {
      user_id: this.userId,  // ID de l'utilisateur
      is_regular: this.isRegular,  // Indique si la commande est régulière
      regularity_type: this.isRegular ? this.regularityType : null,  // Type de régularité
      interval: this.isRegular ? this.interval : null,  // Intervalle de temps
      cart_items: this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))  // Détails des articles dans le panier
    };

    // Si la commande est régulière, mettre à jour le statut VIP de l'utilisateur
    if (this.isRegular) {
      this.updateVipStatus(true);  // Définir le statut VIP à true (1)
    }

    this.postService.placeOrder(orderData).subscribe(
      (response) => {
        alert('Commande validée avec succès.');
        this.cartItems = [];
      },
      (error) => {
        alert('Une erreur est survenue lors de la validation du panier.');
      }
    );
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
  // Méthode pour mettre à jour le statut VIP de l'utilisateur
  updateVipStatus(isRegular: boolean): void {
    this.userService.updateVipStatus(this.userId, isRegular).subscribe(
      (response) => {
        console.log('VIP status mis à jour:', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du VIP status:', error);
      }
    );
  }

  removeItem(item: any): void {
    const index = this.cartItems.indexOf(item); // Trouve l'index de l'article dans le panier
    if (index > -1) {
      this.cartItems.splice(index, 1); // Retire l'élément du tableau
    }
  }
  
}
