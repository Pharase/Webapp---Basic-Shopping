import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from './cart.store';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private readonly cartStore = inject(CartStore);
  private readonly orderService = inject(OrderService);
  protected readonly items = this.cartStore.items;
  protected readonly total = this.cartStore.total;
  protected readonly checkoutError = signal('');
  protected readonly checkingOut = signal(false);
  protected readonly checkoutSuccess = signal(false);

  protected increment(id: number): void { this.cartStore.increment(id); }
  protected decrement(id: number): void { this.cartStore.decrement(id); }
  protected remove(id: number): void { this.cartStore.remove(id); }

  protected checkout(): void {
    this.checkoutError.set('');
    this.checkoutSuccess.set(false);
    this.checkingOut.set(true);
    this.orderService.checkout(this.items()).subscribe({
      next: () => { this.cartStore.clear(); this.checkoutSuccess.set(true); this.checkingOut.set(false); },
      error: (response: { status?: number; error?: { message?: string } }) => {
        this.checkoutError.set(response.error?.message || (response.status === 401 ? 'Please sign in before checkout.' : 'Checkout failed. Stock may have changed.'));
        this.checkingOut.set(false);
      },
    });
  }
}
