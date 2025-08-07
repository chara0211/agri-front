import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { UserProductsComponent } from './user-products/user-products.component';
import { PostsComponent } from './admin/posts/posts.component'; // Import PostsComponent
import { FarmerOrdersComponent } from './farmer-orders/farmer-orders.component';
import { FarmerClientComponent } from './farmer-client/farmer-client.component';
import { RegularOrdersComponent } from './regular-orders/regular-orders.component';
import { FarmerPostsComponent } from './farmer/farmer-posts/farmer-posts.component'; // New FarmerPostsComponent
import { FarmerNotificationsComponent } from './farmer-notifications/farmer-notifications.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostListClientComponent } from './post-list-client/post-list-client.component';
import { CartComponent } from './cart/cart.component';
import { NotificationOrdersComponent } from './notification-orders/notification-orders.component';
import { NotificationOrdersClientsComponent } from './notification-orders-clients/notification-orders-clients.component';
import { NotificationComponent } from './notification/notification.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' }, // Redirige vers login par défaut
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'farmer/dashboard', component: FarmerDashboardComponent },
  { path: 'client/dashboard', component: ClientDashboardComponent },
  { path: 'user-products/:userId', component: UserProductsComponent }, // Route dynamique

  { path: 'admin/posts', component: PostsComponent }, // Add route for PostsComponent
  { path: 'farmer/:farmer_id/orders', component: FarmerOrdersComponent },
  { path: 'farmer/clients', component: FarmerClientComponent },
  { path: 'farmer/:farmer_id/orders/regular', component: RegularOrdersComponent },
  { path: 'farmer/posts', component: FarmerPostsComponent }, // New route for Farmer Posts
  { path: 'farmer/notifications', component: FarmerNotificationsComponent },
  { path: 'farmer/posts', component: PostListComponent }, // Route dynamique
  { path: 'client/posts', component: PostListClientComponent },
  { path: 'client/cart', component: CartComponent },
  { path: 'client/notifications', component:  NotificationOrdersClientsComponent },
  {path: 'admin/notifications', component: NotificationComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
