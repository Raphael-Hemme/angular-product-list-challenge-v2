import { computed, Injectable, Signal, signal } from '@angular/core';
import { ProductListEntryData } from '../api/api.service';
import { ProductListBrowsingService } from '../product-list-browsing/product-list-browsing.service';
import { ProductListSearchService } from '../product-list-search/product-list-search.service';

export type ListMode = 'RAW' | 'SEARCH';

export const PRODUCT_LIST_PAGE_SIZE = 20;
export const TOTAL_REGULAR_LIST_LENGTH = 200;
export const TOTAL_REGULAR_PAGES =
  TOTAL_REGULAR_LIST_LENGTH / PRODUCT_LIST_PAGE_SIZE;
export const MAX_TOTAL_SEARCH_LIST_LENGTH = 30;
export const MAX_SEARCH_PAGES = Math.ceil(
  MAX_TOTAL_SEARCH_LIST_LENGTH / PRODUCT_LIST_PAGE_SIZE
);

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  public listMode = signal<ListMode>('RAW');
  public currDisplayedProductList!: Signal<ProductListEntryData[]>;
  public retrievalError!: Signal<string | null>;
  public currSharedPageNumber!: Signal<number>;
  public totalListLength!: Signal<number>;
  public maxTotalPages!: Signal<number>;

  constructor(
    private readonly productListBrowsingService: ProductListBrowsingService,
    private readonly productListSearchService: ProductListSearchService
  ) {
    this.currSharedPageNumber = computed(() =>
      this.listMode() === 'SEARCH'
        ? this.productListSearchService.currSearchPageNumber()
        : this.productListBrowsingService.currRawPageNumber()
    );

    this.currDisplayedProductList = computed<ProductListEntryData[]>(() => {
      if (this.listMode() === 'SEARCH') {
        return this.productListSearchService.searchResults()[
          this.currSharedPageNumber() - 1
        ];
      } else {
        return this.productListBrowsingService.productListPagedCache()[
          this.currSharedPageNumber() - 1
        ];
      }
    });

    this.retrievalError = computed(() =>
      this.listMode() === 'SEARCH'
        ? this.productListSearchService.retrievalError()
        : this.productListBrowsingService.retrievalError()
    );

    this.totalListLength = computed(() => {
      switch (this.listMode()) {
        case 'SEARCH':
          return this.productListSearchService.searchResults()?.flat()?.length;
        default: // RAW
          return TOTAL_REGULAR_LIST_LENGTH;
      }
    });

    this.maxTotalPages = computed(() => {
      switch (this.listMode()) {
        case 'SEARCH':
          return MAX_SEARCH_PAGES;
        default: // RAW
          return TOTAL_REGULAR_PAGES;
      }
    });
  }

  public updateCurrPageNumber(newPageNumber: number): void {
    if (this.listMode() === 'SEARCH') {
      this.productListSearchService.currSearchPageNumber.set(newPageNumber);
    } else {
      this.productListBrowsingService.loadPage(newPageNumber);
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
