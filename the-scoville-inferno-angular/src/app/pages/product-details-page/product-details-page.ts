import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsApiService } from '../../modules/products/services/products-api.service';
import { Product } from '../../modules/products/types/products.types';
import { finalize, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { environment } from '../../../environments/environment';
import { CartStore } from '../../modules/cart/store/cart-store';

@Component({
  selector: 'app-product-details-page',
  imports: [RouterLink, ButtonModule, SkeletonModule],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.scss',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly cartStore = inject(CartStore);

  readonly product = signal<Product | null>(null);
  readonly loading = signal<boolean>(true);
  readonly specsOpen = signal<boolean>(true);
  readonly addingToCart = this.cartStore.mutating;
  readonly isProductInCart = computed(() => {
    const product = this.product();
    if (product) {
      return Boolean(this.cartStore.getCartItem(product.id));
    }
    return false;
  })

  // Заглушка
  readonly reviews = [
    {
      rating: 5,
      title: 'This is the real deal!',
      text: 'Added a single drop to a full pot of chili and it was perfect. The flavor is incredible once you survive the heat.',
      author: 'ChiliHead_27',
    },
    {
      rating: 4,
      title: 'Painfully Delicious',
      text: "Beyond the beautiful, brutal heat, there's a really nice fruity flavor. I used it to make a spicy mayo and it's incredible. Just be careful, it's not forgiving.",
      author: 'SpiceMasochist',
    },
    {
      rating: 1,
      title: "I've Made A Huge Mistake",
      text: "My friend dared me. It's been an hour. I can see sounds. My disappointment is immeasurable and my day is ruined. This is a weapon, not a spice.",
      author: 'RegretfulRookie',
    },
  ];

  constructor() {
    this.route.paramMap
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((params) =>
          this.productsApiService
            .getProductDetails(params.get('id') ?? '')
            .pipe(finalize(() => this.loading.set(false)))
        ),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (response) => this.product.set(response.data),
        error: () => this.router.navigateByUrl('/products'),
      });
  }

  addToCart() {
    const product = this.product();
    if (!product || !product.inStock) {
      return;
    }
    this.cartStore.add(product.id);
  }

  removeFromCart() {
    const product = this.product();
    
    if (!product || !product.inStock) {
      return;
    }

    const cartItemId = this.cartStore.getCartItem(product.id)?.id
    
    if (!cartItemId) {
      return
    }
    this.cartStore.remove(cartItemId);
  }

  toggleSpecs() {
    this.specsOpen.update((open) => !open);
  }

  formatScoville(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  scovilleRange(product: Product): string {
    const heatLevel = product.heatLevel;
    if (!heatLevel) {
      return this.formatScoville(product.scoville);
    }
    const max = heatLevel.maxScoville !== null ? this.formatScoville(heatLevel.maxScoville) : '∞';
    return `${this.formatScoville(heatLevel.minScoville)} – ${max}`;
  }

  // Заглушка
  stars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  generatePublicImageUrl(imageUrl: string) {
    return `${environment.baseApiUrl}${imageUrl}`
  }
}