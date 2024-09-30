import { computed, Injectable, signal } from '@angular/core';
import {
  ApiService,
  ProductDetailsData,
  ProductListEntryData
} from '../api/api.service';
import { filter, take, tap } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

export const PRODUCT_LIST_PAGE_SIZE = 20;
export const TOTAL_REGULAR_LIST_LENGTH = 200;
export const TOTAL_REGULAR_PAGES =
  TOTAL_REGULAR_LIST_LENGTH / PRODUCT_LIST_PAGE_SIZE;

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  public listMode = signal<'REGULAR' | 'SEARCH'>('REGULAR');

  /* Data for the regular product list */
  // Todo: extract into separate SearchServicees
  public currRegularPageNumber = signal<number>(1);
  public currSearchTerm = signal<string>('');
  public productListPagedCache = signal<ProductListEntryData[][]>(
    this.generateInitiallyEmptyProductListCache()
  );

  /* Data for the search results */
  public searchResults = signal<ProductListEntryData[][]>([]);
  public currSearchPageNumber = signal<number>(1);

  /* Shared data between the two modes */
  public currDisplayedProductList = computed<ProductListEntryData[]>(() => {
    if (this.listMode() === 'SEARCH') {
      return this.searchResults()[this.currSearchPageNumber() - 1];
    } else {
      return this.productListPagedCache()[this.currRegularPageNumber() - 1];
    }
  });
  public currPageSharedPageNumber = computed(() =>
    this.listMode() === 'SEARCH'
      ? this.currSearchPageNumber()
      : this.currRegularPageNumber()
  );

  public totalListLength = computed(() => {
    if (this.listMode() === 'SEARCH') {
      return this.searchResults().flat().length;
    } else {
      return TOTAL_REGULAR_LIST_LENGTH;
    }
  });

  public retrievalError = signal<string | null>(null);

  constructor(
    private readonly apiService: ApiService,
    private readonly loadingService: LoadingService
  ) {}

  public updateCurrPageNumber(newPageNumber: number): void {
    if (this.listMode() === 'SEARCH') {
      this.currSearchPageNumber.set(newPageNumber);
    } else {
      this.loadPage(newPageNumber);
    }
  }

  private generateInitiallyEmptyProductListCache(): ProductListEntryData[][] {
    return Array.from({ length: TOTAL_REGULAR_PAGES }, () => []);
  }

  private addNewProductBatchToCache(forPageNumber: number): void {
    const insertIndex = forPageNumber - 1;

    this.apiService
      .getProductListBatch(forPageNumber)
      .pipe(
        take(1),
        tap((newBatch) => {
          this.productListPagedCache.update((cache) => {
            const newCacheState = [...cache];
            newCacheState[insertIndex] = this.getTypeSafeResonseDataOrDefault(
              newBatch.data
            );
            return newCacheState;
          });
          this.retrievalError.set(newBatch.error);
        }),
        tap(() => this.loadingService.isLoadingRegularList.set(false)),
        filter((newBatch) => !!!newBatch.error),
        tap(() => this.currRegularPageNumber.set(forPageNumber))
      )
      .subscribe();
  }

  public loadPage(pageNumber: number): void {
    this.loadingService.isLoadingRegularList.set(true);
    if (this.productListPagedCache()[pageNumber - 1].length === 0) {
      this.addNewProductBatchToCache(pageNumber);
    } else {
      this.currRegularPageNumber.set(pageNumber);
      this.loadingService.isLoadingRegularList.set(false);
    }
  }

  public searchProducts(searchTerm: string): void {
    this.loadingService.isLoadingSearchResults.set(true);
    this.apiService
      .searchProducts(searchTerm)
      .pipe(
        take(1),
        tap((searchResults) => {
          this.listMode.set('SEARCH');
          const chunkedArr = this.chunkSearchResultsIntoPages(
            this.getTypeSafeResonseDataOrDefault(searchResults.data)
          );
          this.searchResults.set(chunkedArr);
          this.retrievalError.set(searchResults.error);
        }),
        tap(() => this.loadingService.isLoadingSearchResults.set(false))
      )
      .subscribe();
  }

  public clearSearchResults(): void {
    this.searchResults.set([]);
    this.retrievalError.set(null);
    this.listMode.set('REGULAR');
  }

  private chunkSearchResultsIntoPages(
    searchResults: ProductListEntryData[]
  ): ProductListEntryData[][] {
    const chunkedSearchResults = [];
    for (let i = 0; i < searchResults.length; i += PRODUCT_LIST_PAGE_SIZE) {
      const chunk = searchResults.slice(i, i + PRODUCT_LIST_PAGE_SIZE);
      chunkedSearchResults.push(chunk);
    }
    return chunkedSearchResults.length > 0 ? chunkedSearchResults : [[]];
  }

  private getTypeSafeResonseDataOrDefault(
    internalResponseData: ProductListEntryData[] | ProductDetailsData | null
  ): ProductListEntryData[] {
    return Array.isArray(internalResponseData) ? internalResponseData : [];
  }
}
