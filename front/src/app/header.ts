import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../cart/cart.store';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly cartStore = inject(CartStore);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  protected readonly cartCount = this.cartStore.count;
  protected readonly isLoggedIn = this.authService.isLoggedIn;

  protected logout(): void {
    this.userService.logout().subscribe({
      next: () => this.authService.logout(),
      error: () => this.authService.logout(),
    });
  }
}
