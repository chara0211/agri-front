import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { AuthService } from '../../auth.service'; 
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  userName: string; // User who commented
}

interface Post {
  id: number;
  title: string;
  content: string;
  farmer_id: number;
  image: string | null;
  comments: Comment[];
  userName: string;
  newCommentContent?: string;
  newTitle?: string;
  newContent?: string;
  isEditing?: boolean;
  showComments: boolean; // Add this field to control visibility of comments
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: false,
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = []; // Stores filtered posts
  searchQuery: string = ''; // Stores the search query

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  // Fetch posts with comments
  getPosts(): void {
    this.postService.getPosts().subscribe(
      (data: Post[]) => {
        console.log('Fetched Posts:', data);
        this.posts = data;
        this.filteredPosts = data; // Initially show all posts

        // Fetch comments for each post using forkJoin
        const commentRequests = this.posts.map(post => 
          this.postService.getCommentsForPost(post.id).pipe(
            map((comments: Comment[]) => {
              return {
                postId: post.id,
                comments: comments.map(comment => ({
                  ...comment,
                  userName: comment.userName || 'Anonymous', // Default if no userName is found
                })),
              };
            })
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
            console.error('Error fetching comments', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching posts', error);
      }
    );
  }

  // Filter posts by title or userName
  filterPosts(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(query) || post.userName.toLowerCase().includes(query)
    );
  }

  // Delete a comment from a post
  deleteComment(post: Post, comment: Comment): void {
    const confirmation = confirm('Are you sure you want to delete this comment?');

    if (confirmation) {
      this.postService.deleteComment(comment.id).subscribe(
        () => {
          post.comments = post.comments.filter(c => c.id !== comment.id);
        },
        (error) => {
          console.error('Error deleting comment', error);
          alert('An error occurred while deleting the comment.');
        }
      );
    }
  }

  // Delete a post
  deletePost(post: Post): void {
    const confirmation = confirm('Are you sure you want to delete this post?');

    if (confirmation) {
      this.postService.deletePost(post.id).subscribe(
        () => {
          this.posts = this.posts.filter(p => p.id !== post.id);
        },
        (error) => {
          console.error('Error deleting post', error);
          alert('An error occurred while deleting the post.');
        }
      );
    }
  }

  // Update a post
  updatePost(post: Post): void {
    const updatedPost = {
      title: post.newTitle ?? post.title,
      content: post.newContent ?? post.content,
      image: post.image, // Keep current image
    };

    this.postService.updatePost(post.id, updatedPost).subscribe(
      (response: any) => {
        post.title = updatedPost.title;
        post.content = updatedPost.content;
        post.isEditing = false;
      },
      (error) => {
        console.error('Error updating post', error);
        alert('An error occurred while updating the post.');
      }
    );
  }
  toggleComments(post: Post): void {
    post.showComments = !post.showComments; // Toggle visibility
  }
  // Add a comment to a post
  addComment(post: Post): void {
    if (!post.newCommentContent?.trim()) {
      alert('The comment cannot be empty.');
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
        post.newCommentContent = ''; // Reset comment input
      },
      (error) => {
        console.error('Error adding comment', error);
        alert('An error occurred while adding the comment.');
      }
    );
  }

  // Get image URL for a post
  getImageUrl(imagePath: string): string {
    return 'http://localhost:8000/storage/' + imagePath;
  }

  
}
