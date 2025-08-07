import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';  // Assure-toi d'importer le composant
import { HttpClientModule } from '@angular/common/http';  // Ajoute cette ligne
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';  // Import CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';  // Importer AppRoutingModule
import { ProductService } from './product.service';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { ClientSidebarComponent } from './client-sidebar/client-sidebar.component';
import { FarmerSidebarComponent } from './farmer-sidebar/farmer-sidebar.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostListClientComponent } from './post-list-client/post-list-client.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { CartComponent } from './cart/cart.component';
import { OrderListComponent } from './order-list/order-list.component';
import { PostsComponent } from './admin/posts/posts.component';
import { FarmerOrdersComponent } from './farmer-orders/farmer-orders.component';
import { FarmerClientComponent } from './farmer-client/farmer-client.component';
import { RegularOrdersComponent } from './regular-orders/regular-orders.component';
import { FarmerPostsComponent } from './farmer/farmer-posts/farmer-posts.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationOrdersComponent } from './notification-orders/notification-orders.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationOrdersClientsComponent } from './notification-orders-clients/notification-orders-clients.component';
import { FarmerNotificationsComponent } from './farmer-notifications/farmer-notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    FarmerDashboardComponent,
    ClientDashboardComponent,
    AdminSidebarComponent,
    ClientSidebarComponent,
    FarmerSidebarComponent,
    PostFormComponent,
    PostListComponent,
    PostListClientComponent,
    UserProductsComponent,
    CartComponent,
    OrderListComponent,
    PostsComponent,
    FarmerOrdersComponent,
    FarmerClientComponent,
    RegularOrdersComponent,
    FarmerPostsComponent,
    NotificationComponent,
    NotificationOrdersComponent,
    NotificationOrdersClientsComponent,
    FarmerNotificationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Add FormsModule here
    CommonModule,  // Add CommonModule here
    SignupComponent,
    LoginComponent,
    HttpClientModule , // Importe le composant ici si tu le gardes comme standalone
    AppRoutingModule, // Ajouter AppRoutingModule
    NgxPaginationModule,

  

  ],
  providers: [AuthService,ProductService],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
