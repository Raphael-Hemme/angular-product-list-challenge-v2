import { Component, computed, Signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  PRODUCT_LIST_PAGE_SIZE,
  ProductListService,
  TOTAL_REGULAR_LIST_LENGTH,
} from '../../../core/services/product-list/product-list.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  public length = TOTAL_REGULAR_LIST_LENGTH;
  public pageSize = PRODUCT_LIST_PAGE_SIZE;
  public disabled = false;
  public pageIndex!: Signal<number>;

  constructor(private productListServece: ProductListService) {
    this.pageIndex = computed(
      () => this.productListServece.currRegularPageNumber() - 1,
    );
  }

  public handlePageEvent(event: PageEvent): void {
    if (event.pageIndex <= 0 || event.pageIndex >= TOTAL_REGULAR_LIST_LENGTH) {
      return;
    }
    this.productListServece.loadPage(event.pageIndex + 1);
  }
}
