import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartStore } from '../cart/cart.store';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly categoryService = inject(CategoryService);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly authError = signal('');
  protected readonly isAdmin = this.authService.isAdmin;
  protected readonly editingId = signal<number | null>(null);
  protected productName = '';
  protected productDetail = '';
  protected productPrice = 0;
  protected productStock = 0;
  protected productImageUrl = '';
  protected productCategoryName = '';
  protected productSaveError = signal('');
  protected readonly categories = signal<Category[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
      this.loadCategories();
    } else {
      this.loading.set(false);
    }
  }

  protected loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.error.set('');
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: () => {
        this.products.set([]);
        this.error.set('Unable to load products from the database.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected addToCart(product: Product): void {
    this.authError.set('');
    if (!this.authService.isLoggedIn()) {
      this.authError.set('Please sign in before adding products to your cart.');
      return;
    }
    if (product.stock > 0) this.cartStore.add(product);
  }

  protected startEdit(product: Product): void {
    this.editingId.set(product.id);
    this.productName = product.name;
    this.productDetail = product.detail;
    this.productPrice = product.price;
    this.productStock = product.stock;
    this.productImageUrl = product.imageUrl || '';
    this.productCategoryName = product.category?.name || '';
    this.productSaveError.set('');
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.productSaveError.set('');
  }

  protected saveProduct(): void {
    const payload = { name: this.productName.trim(), detail: this.productDetail.trim(), price: this.productPrice, stock: this.productStock, imageUrl: this.productImageUrl.trim() || null, categoryName: this.productCategoryName.trim() };
    if (!payload.name || !payload.categoryName || payload.price < 0 || payload.stock < 0) {
      this.productSaveError.set('Enter a product name, category, valid price, and stock quantity.');
      return;
    }
    const request = this.editingId() === null ? this.productService.create(payload) : this.productService.update(this.editingId()!, payload);
    request.subscribe({
      next: () => { this.cancelEdit(); this.loadProducts(); this.loadCategories(); },
      error: (response: { status?: number }) => this.productSaveError.set(response.status === 403 ? 'Admin access is required.' : 'Unable to save product.'),
    });
  }
}
