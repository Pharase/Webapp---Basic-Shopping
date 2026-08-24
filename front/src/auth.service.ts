import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = signal<AuthUser | null>(null);
  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = signal(false);
  readonly isAdmin = signal(false);

  login(email: string, role = 'user'): void {
    this.user.set({ email, role });
    this.isLoggedIn.set(true);
    this.isAdmin.set(role === 'admin');
  }

  logout(): void {
    this.user.set(null);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
  }
}
