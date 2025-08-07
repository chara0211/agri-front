import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface Comment {
  id: number;
  userName: string;
  content: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  farmer_id: number;
  image: string | null;
  comments: Comment[];
  userName: string;
  created_at: string;  // Add created_at
  updated_at: string;  // Add updated_at
  newCommentContent?: string;
  newTitle?: string;
  newContent?: string;
  isEditing?: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: false,
})
export class AdminDashboardComponent implements OnInit {
  userName: string = '';
  users: any[] = [];
  posts: Post[] = [];
  filteredUsers: any[] = []; // Filtered list of users
  filteredPosts: Post[] = []; // Filtered list of posts
  farmerStats: any[] = [];
  maxRevenue: number = 0;
  paginatedUsers: any[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 5; // Users per page



  totalUsers: number = 0;
  totalFarmers: number = 0;
  totalClients: number = 0;
  totalAdmins: number = 0;
  totalPosts: number = 0;

  searchQuery: string = ''; // Search input query
  selectedUserRole: string = ''; // Filter for user roles
  currentFarmerId: number = 0; // To track the currently viewed farmer's ID
  currentPostIndex: number = 0; // Index of the currently displayed post in the carousel
  currentFarmerName: string = '';  // Store the name of the selected farmer

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUserName(); // Get logged-in user name
    this.loadUsers(); // Load users data
    this.loadStats(); // Load statistics data
    this.getPosts(); // Load posts data
    this.getFarmerStats(); // Fetch farmer statistics


    this.filteredUsers = [...this.users]; // Initialize filtered users
    this.filteredPosts = [...this.posts]; // Initialize filtered posts
  }

  loadStats(): void {
    this.totalFarmers = this.users.filter(user => user.role === 'farmer').length;
    this.totalClients = this.users.filter(user => user.role === 'client').length;
    this.totalAdmins = this.users.filter(user => user.role === 'admin').length;
    this.totalUsers = this.users.length; // Total number of users
    this.totalPosts = this.posts.length; // Total posts
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8000/api/users').subscribe((data) => {
      this.users = data;
      this.loadStats(); // Recalculate stats after loading users
      this.onSearch(); // Apply search/filter logic after loading users
      this.paginateUsers();

    });
  }
  changePage(page: number): void {
    // Check if the page is within the valid range
    if (page < 1) {
      this.currentPage = 1;  // Ensure it doesn't go below 1
    } else if (page > Math.ceil(this.filteredUsers.length / this.itemsPerPage)) {
      this.currentPage = Math.ceil(this.filteredUsers.length / this.itemsPerPage);  // Ensure it doesn't exceed max pages
    } else {
      this.currentPage = page;
    }
    this.paginateUsers();
  }
  
  nextPage(): void {
    if (this.currentPage < Math.ceil(this.filteredUsers.length / this.itemsPerPage)) {
      this.changePage(this.currentPage + 1);
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  
  
  
  

  paginateUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  getPosts(): void {
    this.http.get<Post[]>('http://localhost:8000/api/posts').subscribe(
      (data) => {
        console.log('Posts fetched:', data);
        if (Array.isArray(data)) {
          this.posts = data.map((post) => {
            post.newCommentContent = '';
            post.newTitle = post.title ?? '';
            post.newContent = post.content ?? '';
            post.comments = [];
            post.imageUrl = this.getImageUrl(post.image ?? '');
  
            // Format timestamps using the new formatDate method
            post.created_at = this.formatDate(post.created_at);
            post.updated_at = this.formatDate(post.updated_at);
  
            this.http.get<Comment[]>(`http://localhost:8000/api/posts/${post.id}/comments`).subscribe(
              (comments) => {
                post.comments = comments.map((comment) => ({
                  ...comment,
                  userName: comment.userName || 'Anonymous',
                }));
              },
              (error) => {
                console.error(`Error fetching comments for post ${post.id}:`, error);
              }
            );
  
            return post;
          });
          this.loadStats(); // Recalculate stats after loading posts
          this.onSearch(); // Apply search/filter logic after loading posts
        } else {
          console.error('Data is not an array', data);
        }
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  
  
  formatDate(dateString: string): string {
    // Create a Date object from the ISO string
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // If invalid, return the original string
    }
  
    // Format the date into a readable format like: "2025-01-07 15:44:38"
    return date.toLocaleString('en-GB', { // Use 'en-GB' for the desired format
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    }).replace(',', ''); // Remove the comma from the formatted string
  }
  
  

  getImageUrl(imagePath: string): string {
    return imagePath ? `http://localhost:8000/storage/${imagePath}` : '';
  }

  deleteUser(userId: number): void {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.http.delete(`http://localhost:8000/api/users/${userId}`).subscribe(
        () => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user.');
        }
      );
    }
  }

  deletePost(postId: number): void {
    const confirmation = confirm('Are you sure you want to delete this post?');
    if (confirmation) {
      this.http.delete(`http://localhost:8000/api/posts/${postId}`).subscribe(
        () => {
          alert('Post deleted successfully!');
          this.getPosts();
        },
        (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post.');
        }
      );
    }
  }

  onSearch(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesQuery =
        !this.searchQuery ||
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = !this.selectedUserRole || user.role === this.selectedUserRole;
      return matchesQuery && matchesRole;
    });
    this.currentPage = 1; // Reset to the first page
    this.paginateUsers();

    this.filteredPosts = this.posts.filter((post) => {
      return (
        !this.searchQuery ||
        post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  showModal: boolean = false; // To toggle the modal visibility

  // Toggle the modal visibility
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // Pagination
  nextPost(): void {
    if (this.currentPostIndex < this.filteredPosts.length - 1) {
      this.currentPostIndex++;
    } else {
      this.currentPostIndex = 0;
    }
  }

  prevPost(): void {
    if (this.currentPostIndex > 0) {
      this.currentPostIndex--;
    } else {
      this.currentPostIndex = this.filteredPosts.length - 1;
    }
  }

  // View posts for a farmer
  viewAllPosts(farmerId: number): void {
    const farmer = this.users.find(user => user.id === farmerId);
    if (farmer) {
      this.currentFarmerName = farmer.name;
    }
    this.currentFarmerId = farmerId;
    this.showModal = true;
    // Fetch posts for the selected farmer
    this.http.get<Post[]>(`http://localhost:8000/api/posts?farmer_id=${farmerId}`).subscribe(
      (data) => {
        this.filteredPosts = [...data];
        this.currentPostIndex = 0; // Reset to first post
      },
      (error) => {
        console.error('Error fetching posts for farmer:', error);
        alert('Failed to fetch posts.');
      }
    );
  }
  getFarmerStats(): void {
    this.http.get<any[]>('http://localhost:8000/api/farmer-stats').subscribe(
      (data) => {
        this.farmerStats = data;
        this.initializeChart(); // Initialize chart after fetching data
      },
      (error) => {
        console.error('Error fetching farmer statistics:', error);
      }
    );
  }

  initializeChart(): void {
    if (this.farmerStats.length > 0) {
      const ctx = document.getElementById('farmerChart') as HTMLCanvasElement;
  
      const labels = this.farmerStats.map((farmer) => farmer.farmer_name);
      const salesData = this.farmerStats.map((farmer) => farmer.total_sales);
      const revenueData = this.farmerStats.map((farmer) => farmer.total_revenue);
  
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Sales',
              data: salesData,
              backgroundColor: 'rgba(34, 139, 34, 0.7)', // Forest Green
              borderColor: 'rgba(34, 139, 34, 1)', // Strong Green
              borderWidth: 3,
              borderRadius: 8, // Rounded bars
            },
            {
              label: 'Total Revenue',
              data: revenueData,
              backgroundColor: 'rgba(222, 184, 135, 0.7)', // Wheat
              borderColor: 'rgba(222, 184, 135, 1)', // Strong Wheat
              borderWidth: 3,
              borderRadius: 8, // Rounded bars
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows height adjustments
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 16,
                  family: 'Arial, sans-serif', // Modern font
                  weight: 600, // Bold font
                },
                color: '#2E8B57', // Sea Green text color
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Farmers',
                font: {
                  size: 16,
                  weight: 600, // Bold font
                },
                color: '#2E8B57', // Sea Green
              },
              ticks: {
                color: '#2E8B57', // Sea Green
              },
            },
            y: {
              title: {
                display: true,
                text: 'Value (in $)',
                font: {
                  size: 16,
                  weight: 600, // Bold font
                },
                color: '#2E8B57', // Sea Green
              },
              ticks: {
                color: '#2E8B57', // Sea Green
              },
              beginAtZero: true,
            },
          },
        },
      };
  
      new Chart(ctx, config);
    }
  }
  
  
}