import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal
} from '@angular/core';
import {
  PRODUCT_LIST_PAGE_SIZE,
  ProductListService
} from '../../../core/services/product-list/product-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  public length!: Signal<number>;
  public pageSize = PRODUCT_LIST_PAGE_SIZE;
  public disabled = false;
  public pageNumber!: Signal<number>;
  public pageIndex!: Signal<number>;

  public firstPageIsDisabled!: Signal<boolean>;
  public prevPageIsDisabled!: Signal<boolean>;
  public nextPageIsDisabled!: Signal<boolean>;
  public lastPageIsDisabled!: Signal<boolean>;
  public paginatorDisplayStr!: Signal<string>;

  constructor(
    private productListServece: ProductListService,
    private readonly router: Router
  ) {
    this.pageNumber = computed(() => {
      return this.productListServece.currSharedPageNumber();
    });

    this.pageIndex = computed(() => this.pageNumber() - 1);

    this.length = this.productListServece.totalListLength;

    this.firstPageIsDisabled = computed(() => {
      return this.pageIndex() === 0;
    });

    this.lastPageIsDisabled = computed(
      () =>
        this.pageIndex() ===
        Math.ceil(this.length() / PRODUCT_LIST_PAGE_SIZE) - 1
    );

    this.prevPageIsDisabled = computed(() => this.pageIndex() <= 0);

    this.nextPageIsDisabled = computed(
      () =>
        this.pageIndex() ===
        Math.ceil(this.length() / PRODUCT_LIST_PAGE_SIZE) - 1
    );

    this.paginatorDisplayStr = computed(() => {
      const currStart = this.pageIndex() * PRODUCT_LIST_PAGE_SIZE + 1;
      const currEnd = Math.min(
        this.pageIndex() * PRODUCT_LIST_PAGE_SIZE + PRODUCT_LIST_PAGE_SIZE,
        this.length()
      );
      return `${currStart} - ${currEnd} of ${this.length()}`;
    });
  }

  public handleFirstPageBtn(): void {
    this.router.navigate(['/products'], {
      queryParams: { page: 1 }
    });
  }

  public handleLastPageBtn(): void {
    const lastPage = Math.ceil(this.length() / PRODUCT_LIST_PAGE_SIZE);
    this.router.navigate(['/products'], {
      queryParams: { page: lastPage }
    });
  }

  public handlePrevPageBtn(): void {
    this.router.navigate(['/products'], {
      queryParams: { page: this.pageNumber() - 1 }
    });
  }

  public handleNextPageBtn(): void {
    this.router.navigate(['/products'], {
      queryParams: { page: this.pageNumber() + 1 }
    });
  }
}
