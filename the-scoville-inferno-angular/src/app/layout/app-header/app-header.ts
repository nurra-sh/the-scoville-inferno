import { Component, computed, inject, Inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Auth } from '../../modules/auth/services/auth';
import { OverlayBadge } from 'primeng/overlaybadge';
import { CartStore } from '../../modules/cart/store/cart-store';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, OverlayBadge],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  private readonly router = inject(Router)
    private readonly authService = inject(Auth)
    readonly isAuthenticated = computed(() => this.authService.isAuthenticated())
    private readonly cartStore = inject(CartStore)
    readonly cartCount = this.cartStore.totalQuantity

    logout() {
      this.authService.clearSession()
      this.router.navigateByUrl('/login')
    }
 }