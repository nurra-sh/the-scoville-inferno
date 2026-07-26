import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsApiService } from '../../../modules/products/services/products-api.service';
import { CategoriesApiService } from '../../../modules/categories/services/categories-api.service';
import { MessageService } from 'primeng/api';
import { Category } from '../../../modules/categories/types/categories.types';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APP_TOAST_KEY } from '../../../core/constants/toats.constants';
import { CreateProductBody, UpdateProductBody } from '../../../modules/products/types/products.types';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './admin-product-form-page.html',
  styleUrl: './admin-product-form-page.scss',
})
export class AdminProductFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly categoriesApiService = inject(CategoriesApiService);
  private readonly messageService = inject(MessageService);

  readonly productId = signal<number | null>(null);
  readonly isEdit = computed(() => this.productId() !== null);

  readonly categories = signal<Category[]>([]);
  readonly selectedCategoryId = signal<number | null>(null);

  readonly imageUrl = signal<string | null>(null);
  readonly imagePreview = signal<string | null>(null);
  private selectedFile: File | null = null;

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly isActive = signal<boolean>(true);

  readonly isActiveValue = this.isActive.asReadonly()

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId.set(Number(idParam));
      this.loadProduct(idParam);
    }
  }

  selectCategory(id: number) {
    this.selectedCategoryId.set(id);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.selectedFile = file;
    this.imagePreview.set(URL.createObjectURL(file));
  }

  private loadCategories() {
    this.categoriesApiService.getCategories().subscribe((response) => this.categories.set(response.data));
  }

  private loadProduct(id: string) {
    this.loading.set(true);
    this.productsApiService
      .adminGetProduct(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        const product = response.data;
        this.form.patchValue({
          name: product.name,
          description: product.description ?? '',
          price: Number(product.price),
        });
        this.selectedCategoryId.set(product.categoryId);
        this.imageUrl.set(product.imageUrl);
        this.imagePreview.set(`${environment.baseApiUrl}${product.imageUrl}`);
        this.isActive.set(product.isActive);
      });
  }

  save() {
    if (this.form.invalid || this.selectedCategoryId() === null) {
      this.form.markAllAsTouched();
      this.messageService.add({
        key: APP_TOAST_KEY,
        severity: 'warn',
        summary: 'Проверьте форму',
        detail: 'Заполните название, цену и выберите категорию',
      });
      return;
    }

    this.saving.set(true);

    // Если выбран новый файл — сперва загружаем его, затем сохраняем товар
    if (this.selectedFile) {
      this.productsApiService.uploadProductImage(this.selectedFile).subscribe({
        next: (response) => {
          this.imageUrl.set(response.url);
          this.persist();
        },
        error: () => this.saving.set(false),
      });
    } else {
      this.persist();
    }
  }

  remove() {
    const id = this.productId();
    if (id === null) {
      return;
    }
    this.productsApiService.deleteProduct(id).subscribe(() => {
      this.messageService.add({
        key: APP_TOAST_KEY,
        severity: 'success',
        summary: 'Удалено',
        detail: 'Товар удалён',
      });
      this.router.navigateByUrl('/admin/products');
    });
  }

  hide() {
    const id = this.productId();
    if (id === null) {
      return;
    }
    this.productsApiService.updateProduct(id, {
      isActive: !this.isActiveValue()
    }).subscribe((response) => {
      this.isActive.set(response.data.isActive);
      this.messageService.add({
        key: APP_TOAST_KEY,
        severity: 'success',
        summary: 'Готово',
        detail: response.data.isActive ? 'Товар показан' : 'Товар скрыт',
      });
    });
  }

  private persist() {
    const raw = this.form.getRawValue();
    const body: CreateProductBody | UpdateProductBody = {
      name: raw.name.trim(),
      description: raw.description.trim() || null,
      price: Number(raw.price),
      categoryId: this.selectedCategoryId()!,
      imageUrl: this.imageUrl(),
    };

    const id = this.productId();
    const request$ = id
      ? this.productsApiService.updateProduct(id, body)
      : this.productsApiService.createProduct(body as CreateProductBody);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe(() => {
      this.messageService.add({
        key: APP_TOAST_KEY,
        severity: 'success',
        summary: 'Сохранено',
        detail: id ? 'Товар обновлён' : 'Товар создан',
      });
      this.router.navigateByUrl('/admin/products');
    });
  }
}