import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly saving = signal(false);
  protected username = '';
  protected fullName = '';
  protected email = '';
  protected password = '';

  protected register(): void {
    if (!this.username.trim() || !this.fullName.trim() || !this.email.trim() || !this.password) {
      this.error.set('Please complete all fields.');
      return;
    }

    this.error.set('');
    this.saving.set(true);
    this.userService.register({
      username: this.username.trim(),
      fullName: this.fullName.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
    }).subscribe({
      next: (user) => {
        this.authService.login(user.email, user.role);
        this.router.navigateByUrl('/');
      },
      error: (response: { error?: { message?: string } }) => {
        this.error.set(response.error?.message || 'Unable to create your account.');
        this.saving.set(false);
      },
    });
  }
}
