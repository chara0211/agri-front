import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../post.service';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient
import { AuthService } from '../auth.service'; // Importer AuthService

@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.scss'],
  standalone: false
})
export class UserProductsComponent implements OnInit {
  userId!: number; // ID de l'utilisateur (récupéré via AuthService)
  products: any[] = []; // Produits de l'utilisateur
  ownerUserId!: number; // ID du propriétaire des produits (récupéré via PostService)

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private http: HttpClient, // Injecter HttpClient
    private authService: AuthService // Injecter AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté via AuthService
    this.userId = this.authService.getUserId(); 

    // Récupérer l'ID de l'utilisateur propriétaire des produits depuis l'URL
    this.ownerUserId = +this.route.snapshot.paramMap.get('userId')!;

    // Récupérer les produits de l'utilisateur propriétaire
    this.getProductsByUser(this.ownerUserId); 
  }

  // Méthode pour récupérer les produits du propriétaire
  getProductsByUser(userId: number): void {
    this.postService.getProductsByUserId(userId).subscribe(
      (products: any[]) => {
        console.log('Produits récupérés :', products);
        this.products = products; // Mise à jour des produits
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
        alert('Impossible de récupérer les produits pour cet utilisateur.');
      }
    );
  }

  // Méthode pour ajouter un produit au panier
  addToCart(product: any): void {
    const cartData = {
      user_id: this.userId, // Utiliser l'ID de l'utilisateur connecté
      product_id: product.id,
      quantity: 1 // Quantité par défaut à 1, à ajuster selon besoin
    };

    // Appel du service pour ajouter au panier
    this.postService.addToCart(cartData).subscribe(
      (response) => {
        console.log('Produit ajouté au panier:', response);
        alert('Produit ajouté au panier !');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier.');
      }
    );
  }
}
