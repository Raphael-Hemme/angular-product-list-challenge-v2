import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  PRODUCT_LIST_PAGE_SIZE,
  ProductListService,
  TOTAL_REGULAR_LIST_LENGTH
} from '../../../core/services/product-list/product-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  public length!: Signal<number>;
  public pageSize = PRODUCT_LIST_PAGE_SIZE;
  public disabled = false;
  public pageIndex!: Signal<number>;

  constructor(
    private productListServece: ProductListService,
    private readonly router: Router
  ) {
    this.pageIndex = computed(
      () => this.productListServece.currPageSharedPageNumber() - 1
    );
    this.length = this.productListServece.totalListLength;
  }

  public handlePageEvent(event: PageEvent): void {
    if (event.pageIndex < 0 || event.pageIndex >= TOTAL_REGULAR_LIST_LENGTH) {
      return;
    }
    this.router.navigate(['/products'], {
      queryParams: { page: event.pageIndex + 1 }
    });
  }
}
