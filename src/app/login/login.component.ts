import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';  // Import Router for redirection
import { CommonModule } from '@angular/common';  // Import CommonModule
import { ReactiveFormsModule } from '@angular/forms';  // Add ReactiveFormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]  // Import the necessary modules
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  passwordVisible: boolean = false;  // Variable to toggle password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router  // Inject Router for redirection
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
  
    this.authService.login(credentials).subscribe(
      response => {
        console.log('Login successful', response);  // Check the whole response object
        console.log('Role:', response.role);  // Check if role is correct
  
        // Store the user info in localStorage/sessionStorage (for persistence)
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.role);
  
        // Redirect based on the role
        if (response.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'farmer') {
          this.router.navigate(['/farmer/dashboard']);
        } else if (response.role === 'client') {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error => {
        this.errorMessage = 'Invalid login credentials.';
      }
    );
  }
  

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;  // Toggle the password visibility state
  }
}
