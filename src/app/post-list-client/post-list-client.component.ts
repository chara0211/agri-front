import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service'; // Import AuthService

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  userName: string; // Nom de l'utilisateur ayant fait le commentaire
}

interface Post {
  id: number;
  title: string;
  content: string;
  farmer_id: number;
  image: string | null;
  newImage?: string | null;  // Store base64 string instead of File
  comments: Comment[];
  userName: string;
  newCommentContent?: string;
  newTitle?: string;
  newContent?: string;
  createdAt: string;

  isEditing?: boolean;
  showComments?: boolean; // Propriété pour gérer l'affichage des commentaires

}

@Component({
  selector: 'app-post-list-client',
  templateUrl: './post-list-client.component.html',
  styleUrls: ['./post-list-client.component.scss'],
  standalone: false,
})
export class PostListClientComponent implements OnInit {
  posts: Post[] = [];
  searchTerm: string = '';

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  // Récupérer tous les posts avec leurs commentaires
  // PostListComponent
getPosts(): void {
  this.postService.getPosts().subscribe(
    (data: Post[]) => {
      console.log('Posts récupérés:', data);
      this.posts = data.map(post => {
        this.postService.getCommentsForPost(post.id).subscribe(
          (comments: Comment[]) => {
            // Map comments to add userName (if necessary)
            post.comments = comments.map(comment => ({
              ...comment,
              userName: comment.userName || 'Anonymous', // Ensure fallback to "Anonymous" if userName is empty
            }));
            console.log('Commentaires pour le post', post.id, comments);
          },
          (error) => {
            console.error('Erreur lors de la récupération des commentaires', error);
          }
        );
        post.newCommentContent = ''; // Initialiser le champ pour un nouveau commentaire
        post.newTitle = post.title ?? ''; // Utilisation de valeurs par défaut
        post.newContent = post.content ?? ''; // Utilisation de valeurs par défaut
        return post;
      });
    },
    (error) => {
      console.error('Erreur lors de la récupération des posts', error);
    }
  );
}

  

  // Soumettre un commentaire pour un post
  addComment(post: Post): void {
    if (!post.newCommentContent?.trim()) {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }

    const newComment = {
      post_id: post.id,
      user_id: this.authService.getUserId(),
      content: post.newCommentContent,
    };

    this.postService.addComment(newComment).subscribe(
      (response: any) => {
        const comment = response.comment;
        post.comments.push(comment);
        post.newCommentContent = '';
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du commentaire', error);
        alert('Une erreur est survenue lors de l\'ajout du commentaire.');
      }
    );
  }

  // Générer l'URL de l'image du post
  getImageUrl(imagePath: string): string {
    return 'http://localhost:8000/storage/' + imagePath;
  }

  editPost(post: Post): void {
    post.isEditing = true;
    post.newTitle = post.title ?? '';
    post.newContent = post.content ?? '';
    post.newImage = null;  // Initialiser l'image à null pour permettre le téléchargement d'une nouvelle image
  }

  cancelEdit(post: Post): void {
    post.isEditing = false;
    post.newTitle = '';
    post.newContent = '';
  }

  updatePost(post: Post): void {
    if (post.newImage) {
      // Clean up the base64 string if an image is selected
      post.newImage = post.newImage.split(',')[1]; // Remove base64 metadata
    }

    const updatedPost = {
      title: post.newTitle ?? '',
      content: post.newContent ?? '',
      image: post.newImage ?? post.image,
    };

    this.postService.updatePost(post.id, updatedPost).subscribe(
      (response: any) => {
        post.title = post.newTitle ?? '';
        post.content = post.newContent ?? '';
        post.isEditing = false;
        post.image = response.updatedPost.image;  // Mettre à jour l'image avec la nouvelle image retournée par l'API
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du post', error);
        alert('Une erreur est survenue lors de la mise à jour du post.');
      }
    );
  }

  onImageChange(event: Event, post: Post): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        post.newImage = reader.result as string;  // Store the base64 image
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  deletePost(post: Post): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce post ?');

    if (confirmation) {
      this.postService.deletePost(post.id).subscribe(
        (response) => {
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        (error) => {
          console.error('Erreur lors de la suppression du post', error);
          alert('Une erreur est survenue lors de la suppression du post.');
        }
      );
    }
  }

  getProductsByUser(userId: number): void {
    this.postService.getProductsByUserId(userId).subscribe(
      (products: any[]) => {
        console.log('Produits de l\'utilisateur :', products);
        // Redirigez ou affichez les produits comme vous le souhaitez.
        alert(`Produits associés à l'utilisateur ${userId} : ${JSON.stringify(products)}`);
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
        alert('Impossible de récupérer les produits pour cet utilisateur.');
      }
    );
  }

  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
  }
  
  get filteredPosts(): Post[] {
    return this.posts.filter(post =>
      post.userName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}