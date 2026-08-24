import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart/cart.store';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/orders';

  checkout(items: CartItem[]): Observable<unknown> {
    return this.http.post(this.apiUrl, {
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    }, { withCredentials: true });
  }
}
