import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-1/login.html',
  styleUrls: ['./login-1/login.css']
})
export class AppComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  // Password visibility state toggle
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Handle core form submission
  onSubmit(): void {
    console.log('Login attempt registered with parameters:', {
      email: this.loginData.email,
      rememberMe: this.loginData.rememberMe
    });
  }

  // Handle forgot password navigation click
  onForgotPassword(event: Event): void {
    event.preventDefault();
    console.log('Forgot password link clicked');
  }

  // Handle navigation to sign up
  onSignUp(event: Event): void {
    event.preventDefault();
    console.log('Navigation to Sign-Up panel triggered');
  }
}