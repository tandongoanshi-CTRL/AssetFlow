import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- ADD THIS IMPORT

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink], // <-- ADD ROUTEROUTLET AND ROUTERLINK HERE
  templateUrl: './app.html',
  styleUrls: ['./login-1/login.css']
})
export class AppComponent {
  // Leave all the internal state logic variables below this line exactly as they are!
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  showPassword = false;
  togglePasswordVisibility(): void { this.showPassword = !this.showPassword; }
  onSubmit(): void { console.log('Login attempt registered:', this.loginData.email); }
  onForgotPassword(event: Event): void { event.preventDefault(); }
  onSignUp(event: Event): void { event.preventDefault(); }
}