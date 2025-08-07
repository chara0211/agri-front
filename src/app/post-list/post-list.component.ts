import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { AuthService } from '../auth.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  newImage?: string | null; // Store base64 string instead of File
  createdAt: string;
  comments: Comment[];
  userName: string;
  newCommentContent?: string;
  newTitle?: string;
  newContent?: string;
  isEditing?: boolean;
  showComments?: boolean; // Propriété pour gérer l'affichage des commentaires
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: false
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isAddPostModalOpen: boolean = false;


  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  // Récupérer tous les posts avec leurs commentaires
  getPosts(): void {
    this.postService.getPosts().subscribe(
      (data: Post[]) => {
        console.log('Posts récupérés:', data);

        // Récupérer l'ID de l'utilisateur actuellement authentifié
        const userId = this.authService.getUserId();

        // Filtrer les posts pour ne garder que ceux qui correspondent à l'ID de l'utilisateur
        this.posts = data.filter(post => post.farmer_id === userId);

        // Utiliser forkJoin pour récupérer les commentaires
        const commentRequests = this.posts.map(post =>
          this.postService.getCommentsForPost(post.id).pipe(
            map((comments: Comment[]) => ({
              postId: post.id,
              comments: comments.map(comment => ({
                ...comment,
                userName: comment.userName || 'Anonymous', // Assurer que le nom est renseigné
              })),
            }))
          )
        );

        forkJoin(commentRequests).subscribe(
          (responses) => {
            responses.forEach(response => {
              const post = this.posts.find(p => p.id === response.postId);
              if (post) {
                post.comments = response.comments;
              }
            });
          },
          (error) => {
            console.error('Erreur lors de la récupération des commentaires', error);
          }
        );
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
        console.error("Erreur lors de l'ajout du commentaire", error);
        alert("Une erreur est survenue lors de l'ajout du commentaire.");
      }
    );
  }

  // Générer l'URL de l'image du post
  getImageUrl(imagePath: string): string {
    return `http://localhost:8000/storage/${imagePath}`;
  }

  editPost(post: Post): void {
    post.isEditing = true;
    post.newTitle = post.title ?? '';
    post.newContent = post.content ?? '';
    post.newImage = null; // Initialiser à null pour permettre le téléchargement d'une nouvelle image
  }

  cancelEdit(post: Post): void {
    post.isEditing = false;
    post.newTitle = '';
    post.newContent = '';
  }

  updatePost(post: Post): void {
    if (post.newImage) {
      // Nettoyer la chaîne base64 si une image est sélectionnée
      post.newImage = post.newImage.split(',')[1]; // Retirer les métadonnées base64
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
        post.image = response.updatedPost.image; // Mettre à jour avec la nouvelle image de l'API
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du post', error);
        alert("Une erreur est survenue lors de la mise à jour du post.");
      }
    );
  }

  onImageChange(event: Event, post: Post): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        post.newImage = reader.result as string; // Stocker l'image en base64
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  deletePost(post: Post): void {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce post ?');

    if (confirmation) {
      this.postService.deletePost(post.id).subscribe(
        () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        (error) => {
          console.error('Erreur lors de la suppression du post', error);
          alert("Une erreur est survenue lors de la suppression du post.");
        }
      );
    }
  }

  toggleComments(post: Post): void {
    post.showComments = !post.showComments;
  }

  openAddPostModal(): void {
    this.isAddPostModalOpen = true;
  }

  // Fermer le modal pour ajouter un post
  closeAddPostModal(): void {
    this.isAddPostModalOpen = false;
  }
}
