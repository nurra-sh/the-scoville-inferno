import { Component, computed, inject, signal } from '@angular/core';
import { ProductsApiService } from '../../modules/products/services/products-api.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product, ProductsFilters } from '../../modules/products/types/products.types';
import { PaginationMeta } from '../../core/types/global.types';
import { Category } from '../../modules/categories/types/categories.types';
import { HeatLevel } from '../../modules/heat-levels/types/heat-levels.types';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesApiService } from '../../modules/categories/services/categories-api.service';
import { HeatLevelsApiService } from '../../modules/heat-levels/services/heat-levels-api.service';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { environment } from '../../../environments/environment';
import { Pagination } from "../../shared/ui/pagination/pagination";

const SORT_OPTIONS = [
  { key: 'new', label: 'New' },
  { key: 'priceLow', label: 'Price Low', sortBy: 'price', order: 'asc' },
  { key: 'priceHigh', label: 'Price High', sortBy: 'price', order: 'desc' },
  { key: 'scoville', label: 'Scoville Rating', sortBy: 'scoville', order: 'desc' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['key'];

const PER_PAGE = 12;

@Component({
  selector: 'app-products-page',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, ButtonModule, CheckboxModule, InputTextModule, SkeletonModule, Pagination],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly productsApiService = inject(ProductsApiService);
  private readonly categoriesApiService = inject(CategoriesApiService);
  private readonly heatLevelsApiService = inject(HeatLevelsApiService);

  readonly sortOptions = SORT_OPTIONS;
  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly products = signal<Product[]>([]);
  readonly meta = signal<PaginationMeta | null>(null);
  readonly loading = signal<boolean>(true);

  readonly categories = signal<Category[]>([]);
  readonly heatLevels = signal<HeatLevel[]>([]);

  readonly selectedCategoryId = signal<number | null>(null);
  readonly selectedHeatLevelId = signal<number | null>(null);
  readonly activeSort = signal<SortKey>('new');
  readonly page = signal<number>(1);

  // Активые чипы
  readonly activeFilterChips = computed(() => {
    const chips: { label: string; remove: () => void }[] = [];

    const category = this.categories().find((c) => c.id === this.selectedCategoryId());
    if (category) {
      chips.push({ label: category.name, remove: () => this.toggleCategory(category.id) });
    }

    const heatLevel = this.heatLevels().find((h) => h.id === this.selectedHeatLevelId());
    if (heatLevel) {
      chips.push({ label: heatLevel.name, remove: () => this.toggleHeatLevel(heatLevel.id) });
    }

    const search = this.searchControl.value.trim();
    if (search) {
      chips.push({ label: `«${search}»`, remove: () => this.searchControl.setValue('') });
    }

    return chips;
  });
  
  constructor() {
    this.loadReferences();
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => {
        this.page.set(1); // сброс страницы при search
        this.loadProducts();
      });
  }

  toggleCategory(id: number) {
    this.selectedCategoryId.update((current) => (current === id ? null : id));
    this.page.set(1);
    this.loadProducts();
  }

  toggleHeatLevel(id: number) {
    this.selectedHeatLevelId.update((current) => (current === id ? null : id));
    this.page.set(1);
    this.loadProducts();
  }

  setSort(key: SortKey) {
    this.activeSort.set(key);
    this.page.set(1);
    this.loadProducts();
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

  generatePublicImageUrl(imageUrl: string) {
    return `${environment.baseApiUrl}${imageUrl}`
  }

  private loadProducts() {
    const sort = SORT_OPTIONS.find((option) => option.key === this.activeSort());

    const filters: ProductsFilters = {
      page: this.page(),
      perPage: PER_PAGE,
      categoryId: this.selectedCategoryId() ?? undefined,
      heatLevelId: this.selectedHeatLevelId() ?? undefined,
      search: this.searchControl.value.trim() || undefined,
      sortBy: sort && 'sortBy' in sort ? sort.sortBy : undefined,
      order: sort && 'order' in sort ? sort.order : undefined,
    };

    this.loading.set(true);
    this.productsApiService
      .getProducts(filters)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.products.set(response.data);
        this.meta.set(response.meta);
      });
  }

  private loadReferences() {
    this.categoriesApiService.getCategories().subscribe((response) => this.categories.set(response.data));
    this.heatLevelsApiService.getHeatLevels().subscribe((response) => this.heatLevels.set(response.data));
  }
}