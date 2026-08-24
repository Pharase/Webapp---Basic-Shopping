import { Injectable, computed, signal } from '@angular/core';

export type CartProduct = { id: number; name: string; price: number; imageUrl: string | null; stock: number };
export type CartItem = CartProduct & { quantity: number };

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly products = signal<CartItem[]>([]);
  readonly items = this.products.asReadonly();
  readonly count = computed(() => this.products().reduce((total, item) => total + item.quantity, 0));
  readonly total = computed(() => this.products().reduce((sum, product) => sum + product.price * product.quantity, 0));

  add(product: CartProduct): void {
    this.products.update((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) return items.map((item) => item.id === product.id && item.quantity < item.stock ? 
      { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, quantity: 1 }];
    });
  }

  increment(id: number): 
    void { 
      this.products.update((items) => items.map((item) => item.id === id && item.quantity < item.stock ? 
      { ...item, quantity: item.quantity + 1 } : item)); 
    }
  decrement(id: number): 
    void { 
      this.products.update((items) => items.flatMap((item) => item.id !== id ? [item] : item.quantity > 1 ? [
        { ...item, quantity: item.quantity - 1 }] : [])); 
      }
  remove(id: number): 
  void {
    this.products.update((items) => items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.products.set([]);
  }
}
