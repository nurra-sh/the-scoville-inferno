import { Component, computed, input, output } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PaginationMeta } from '../../../core/types/global.types';

@Component({
  selector: 'app-pagination',
  imports: [PaginatorModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  readonly meta = input.required<PaginationMeta>();
  readonly pageChange = output<number>();

  readonly first = computed(() => (this.meta().currentPage - 1) * this.meta().perPage);

  onPageChange(event: PaginatorState) {
    this.pageChange.emit((event.page ?? 0) + 1);
  }
}