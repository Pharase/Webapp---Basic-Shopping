import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-credential',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './credential.html',
  styleUrl: './credential.css',
})
export class Credential {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  protected readonly submitted = signal(false);
  protected readonly error = signal('');
  protected email = '';
  protected password = '';

  protected signIn(): void {
    if (!this.email || !this.password) {
      this.error.set('Enter your email and password to continue.');
      return;
    }
    this.error.set('');
    this.userService.login({ email: this.email.trim().toLowerCase(), password: this.password }).subscribe({
      next: (user) => {
        this.authService.login(user.email, user.role);
        this.submitted.set(true);
      },
      error: () => this.error.set('Invalid email or password.'),
    });
  }
}
