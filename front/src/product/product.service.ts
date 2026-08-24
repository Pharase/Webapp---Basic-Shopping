import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product.model';

export type ProductWrite = Omit<Product, 'id' | 'category'> & { categoryName: string };

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { withCredentials: true });
  }

  create(product: ProductWrite): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { withCredentials: true });
  }

  update(id: number, product: ProductWrite): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { withCredentials: true });
  }
}
