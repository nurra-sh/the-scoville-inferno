import { Component, computed, inject, signal } from '@angular/core';
import { ProductsApiService } from '../../../modules/products/services/products-api.service';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../../modules/products/types/products.types';
import { PaginationMeta } from '../../../core/types/global.types';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const PER_PAGE = 8

@Component({
  selector: 'app-admin-products-page',
  imports: [ReactiveFormsModule, DatePipe, ButtonModule, InputTextModule],
  templateUrl: './admin-products-page.html',
  styleUrl: './admin-products-page.scss',
})
export class AdminProductsPage {
  private readonly productsApiService = inject(ProductsApiService);
  private readonly router = inject(Router);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly loading = signal<boolean>(true);
  readonly page = signal<number>(1);

  readonly pageNumbers = computed(() => {
    const meta = this.meta();
    if (!meta) {
      return [];
    }

    const pages = new Set<number>([1, meta.lastPage]);
    for (let p = this.page() - 1; p <= this.page() + 1; p++) {
      if (p >= 1 && p <= meta.lastPage) {
        pages.add(p);
      }
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const result: (number | '...')[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('...');
      }
      result.push(sorted[i]);
    }
    return result;
  });

  constructor() {
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1);
        this.loadProducts();
      });
  }

  goToPage(page: number) {
    const lastPage = this.meta()?.lastPage ?? 1;
    if (page < 1 || page > lastPage || page === this.page()) {
      return;
    }
    this.page.set(page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addProduct() {
    this.router.navigateByUrl('/admin/products/new');
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  private loadProducts() {
    this.loading.set(true);
    this.productsApiService
      .adminGetProducts({
        page: this.page(),
        perPage: PER_PAGE,
        search: this.searchControl.value.trim() || undefined,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.products.set(response.data);
        this.meta.set(response.meta);
      });
  }
}
