import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
// Notice the 3 sets of '../' below!
import { ProductsApiService, DashboardStats } from '../../../modules/products/services/products-api.service'; 

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe, RouterModule], 
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss'
})
export class AdminDashboardPage implements OnInit {
  private productsApiService = inject(ProductsApiService);
  
  stats = signal<DashboardStats | null>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.productsApiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}