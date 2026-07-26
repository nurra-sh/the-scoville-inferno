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
import { Pagination } from "../../../shared/ui/pagination/pagination";

const PER_PAGE = 8

@Component({
  selector: 'app-admin-products-page',
  imports: [ReactiveFormsModule, DatePipe, ButtonModule, InputTextModule, Pagination],
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
