import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service';  // Import the AuthService

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  standalone: false
})
export class PostFormComponent implements OnInit {
  post = {
    farmer_id: 0,  // Initially set to 0, it will be updated when the component initializes
    title: '',
    content: '',
    image: null,  // For the image
  };

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    // Get the logged-in user's ID when the component is initialized
    this.post.farmer_id = this.authService.getUserId();  // Use the method from AuthService to get the user ID
  }

  // Method to submit the form
  submitPost() {
    const formData = new FormData();
    formData.append('farmer_id', this.post.farmer_id.toString());  // Use the dynamic farmer_id
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    if (this.post.image) {
      formData.append('image', this.post.image);
    }

    // Call the service to send data to the backend
    this.postService.createPost(formData).subscribe(
      (response) => {
        console.log('Post créé avec succès:', response);
        // You can show a success message or redirect
      },
      (error) => {
        console.error('Erreur lors de la soumission du post:', error);
      }
    );
  }

  // Method to handle file change (image)
  onImageSelected(event: any) {
    this.post.image = event.target.files[0];
  }
}
