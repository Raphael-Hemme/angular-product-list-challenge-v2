import { computed, Injectable, Signal, signal } from '@angular/core';
import { ProductListEntryData } from '../api/api.service';
import { ProductListRawService } from '../product-list-raw/product-list-raw.service';
import { ProductListSearchService } from '../product-list-search/product-list-search.service';

export type ListMode = 'RAW' | 'SEARCH';

export const PRODUCT_LIST_PAGE_SIZE = 20;
export const TOTAL_REGULAR_LIST_LENGTH = 200;
export const TOTAL_REGULAR_PAGES =
  TOTAL_REGULAR_LIST_LENGTH / PRODUCT_LIST_PAGE_SIZE;

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  public listMode = signal<ListMode>('RAW');
  public currDisplayedProductList!: Signal<ProductListEntryData[]>;
  public retrievalError!: Signal<string | null>;
  public currSharedPageNumber!: Signal<number>;
  public totalListLength!: Signal<number>;

  constructor(
    private readonly productListRawService: ProductListRawService,
    private readonly productListSearchService: ProductListSearchService
  ) {
    this.currSharedPageNumber = computed(() =>
      this.listMode() === 'SEARCH'
        ? this.productListSearchService.currSearchPageNumber()
        : this.productListRawService.currRawPageNumber()
    );

    this.currDisplayedProductList = computed<ProductListEntryData[]>(() => {
      if (this.listMode() === 'SEARCH') {
        return this.productListSearchService.searchResults()[
          this.currSharedPageNumber() - 1
        ];
      } else {
        return this.productListRawService.productListPagedCache()[
          this.currSharedPageNumber() - 1
        ];
      }
    });

    this.retrievalError = computed(() =>
      this.listMode() === 'SEARCH'
        ? this.productListSearchService.retrievalError()
        : this.productListRawService.retrievalError()
    );

    this.totalListLength = computed(() => {
      switch (this.listMode()) {
        case 'SEARCH':
          return this.productListSearchService.searchResults()?.flat()?.length;
        default: // RAW
          return TOTAL_REGULAR_LIST_LENGTH;
      }
    });
  }

  public updateCurrPageNumber(
    newPageNumber: number //  = this.currSharedPageNumber()
  ): void {
    if (this.listMode() === 'SEARCH') {
      this.productListSearchService.currSearchPageNumber.set(newPageNumber);
    } else {
      this.productListRawService.loadPage(newPageNumber);
    }
  }

  public changeMode(mode: ListMode): void {
    this.listMode.set(mode);
  }

  public searchProducts(searchTerm: string): void {
    this.productListSearchService.searchProducts(searchTerm);
    this.changeMode('SEARCH');
  }
}
