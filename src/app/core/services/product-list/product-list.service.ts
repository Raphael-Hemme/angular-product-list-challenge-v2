import { computed, Injectable, signal } from '@angular/core';
import { ApiService, ProductListEntryData } from '../api/api.service';
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
  public currRegularPageNumber = signal<number>(1);

  public productListPagedCache = signal<ProductListEntryData[][]>(
    this.generateInitiallyEmptyProductListCache()
  );

  public currDisplayedProductList = computed<ProductListEntryData[]>(() => {
    if (this.listMode() === 'SEARCH') {
      console.log('displaying searchResults', this.searchResults());
      return this.searchResults();
    } else {
      console.log('displaying regular paginated list');
      return this.productListPagedCache()[this.currRegularPageNumber() - 1];
    }
  });

  public retrievalError = signal<string | null>(null);

  /* Data for the search results */
  public searchResults = signal<ProductListEntryData[]>([]);

  constructor(
    private readonly apiService: ApiService,
    private readonly loadingService: LoadingService
  ) {}

  private generateInitiallyEmptyProductListCache(): ProductListEntryData[][] {
    return Array.from({ length: TOTAL_REGULAR_PAGES }, () => []);
  }

  private addNewProductBatchToCache(forPageNumber: number): void {
    const insertIndex = forPageNumber - 1;

    this.apiService
      .getProductListBatch(forPageNumber)
      .pipe(
        take(1),
        tap((newBatch) => console.log(newBatch)),
        tap((newBatch) => {
          this.productListPagedCache.update((cache) => {
            const newCacheState = [...cache];
            newCacheState[insertIndex] = newBatch.products;
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
        tap((searchResults) => console.log(searchResults)),
        tap((searchResults) => {
          this.listMode.set('SEARCH');
          this.searchResults.set(searchResults.products);
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
}
