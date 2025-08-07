import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf'; // Importer jsPDF
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8000/api/orders'; // URL de l'API Laravel pour les commandes
  private apiUrlFarmer = 'http://127.0.0.1:8000/api/farmer';
 private apiUrlValide = 'http://localhost:8000/api'
  constructor(private http: HttpClient) {}

  // Récupérer les commandes en fonction des paramètres (user_id ou product_id)
  getOrders(userId?: number, productId?: number): Observable<any> {
    let params = new HttpParams();
    
    // Ajouter les paramètres à la requête
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    if (productId) {
      params = params.set('product_id', productId.toString());
    }
    
    return this.http.get<any>(this.apiUrl, { params }); // Envoi de la requête GET avec les paramètres
  }

  getOrdersForFarmer(farmerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlFarmer}/${farmerId}/orders`);
  }

  validateOrder(orderId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrlValide}/orders/${orderId}/validate`, {});  // Méthode PUT pour valider la commande
  }
  downloadReceipt(order: any): void {
  const doc = new jsPDF();

  const logoBase64 = 'assets/logo.png'; // Remplacez par votre Base64
  const pageWidth = doc.internal.pageSize.getWidth(); // Largeur de la page
  const logoWidth = 30; // Largeur du logo
  const logoHeight = 30; // Hauteur du logo
  const marginRight = 10; // Marge droite
  const marginTop = 10; // Marge en haut

  doc.addImage(
    logoBase64,
    'PNG',
    pageWidth - logoWidth - marginRight, // Position X
    marginTop, // Position Y
    logoWidth, // Taille (largeur)
    logoHeight // Taille (hauteur)
  );// Position: (10, 10), Taille: (30x30)
  // Titre principal
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 128); // Couleur bleu
  doc.text('Reçu de la Commande', 105, 15, { align: 'center' });

  // Informations générales sur la commande
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0); // Noir
  doc.text(`Commande ID: #${order.id}`, 10, 30);
  doc.text(`Status: ${order.status}`, 10, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 50);
  doc.text(`Total: ${order.total_amount.toFixed(2)}$`, 10, 60);

  // Ligne séparatrice
  doc.setDrawColor(0, 0, 0); // Noir
  doc.line(10, 65, 200, 65); // Ligne horizontale

  // En-tête des produits
  let startY = 75;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 128); // Bleu
  doc.text('Détails des Produits', 10, startY);

  // Ajouter les colonnes avec style
  startY += 10;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Produit', 10, startY);
  doc.text('Quantité', 80, startY, { align: 'right' });
  doc.text('Prix Unitaire', 120, startY, { align: 'right' });
  doc.text('Total', 190, startY, { align: 'right' });

  startY += 5;
  doc.line(10, startY, 200, startY); // Ligne sous les en-têtes

  // Détails des produits
  doc.setFont('helvetica', 'normal');
  startY += 10;
  order.order_items.forEach((item: any) => {
    const productName = item.product.name || 'N/A'; // Assurez-vous qu'il y a un nom de produit
    const quantity = item.quantity || 0; // Défaut à 0 si non défini
    const unitPrice = parseFloat(item.product.price) || 0; // Convertir en nombre ou défaut à 0
    const totalPrice = (quantity * unitPrice).toFixed(2); // Calculer le total correctement
  
    // Afficher les informations
    doc.text(productName, 10, startY);
    doc.text(String(quantity), 80, startY, { align: 'right' });
    doc.text(`${unitPrice.toFixed(2)}$`, 120, startY, { align: 'right' });
    doc.text(`${totalPrice}$`, 190, startY, { align: 'right' });
  
    startY += 10;
  
    // Vérifiez si la position dépasse la limite de la page
    if (startY > 270) {
      doc.addPage();
      startY = 10;
    }
  });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150); // Gris clair
  doc.text('Merci pour votre commande !', 105, 290, { align: 'center' });

  // Sauvegarde du fichier
  doc.save(`recu_commande_${order.id}.pdf`);
}


    // Sauvegarde du fic
  
}
