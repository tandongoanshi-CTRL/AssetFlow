import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  
  // State initialization object matching data structures
  signupData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAgreement: false
  };

  // State management flags for password eye visibility toggles (handled independently)
  showPassword = false;
  showConfirmPassword = false;

  /**
   * Toggles visibility state processing actions across the main password input
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles visibility state processing actions across the confirm password input
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Intercepts form verification framework processing loops
   * Dispatches runtime syntax consistency validations prior to state mutations
   */
  onSubmit(): void {
    // Required Input Data Checking Loop Validation Layer
    if (!this.signupData.fullName.trim() || !this.signupData.email.trim() || !this.signupData.password || !this.signupData.confirmPassword) {
      alert('Please fill out all required fields.');
      return;
    }

    // Logical Verification: Checking Password Array Sync Status Matches
    if (this.signupData.password !== this.signupData.confirmPassword) {
      alert('Validation Error: Passwords do not match.');
      return;
    }

    // Check if user has accepted the terms and service terms conditions checkbox
    if (!this.signupData.termsAgreement) {
      alert('You must accept the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    // Pack successfully verified registration object mapping schema datasets
    const registrationPayload = {
      fullName: this.signupData.fullName.trim(),
      email: this.signupData.email.trim(),
      termsAccepted: this.signupData.termsAgreement,
      timestamp: new Date().toISOString()
    };

    console.log('Form validated successfully. Submission payload context:', registrationPayload);
    alert('Account created successfully (Mock Process Handled)! Check console log for data payload output details.');
  }
}