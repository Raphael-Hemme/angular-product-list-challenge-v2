import { computed, Injectable, signal } from '@angular/core';
import { ApiService, ProductListEntryData } from '../api/api.service';
import { filter, take, tap } from 'rxjs';

enum DIRECTION {
  FORWARD = 1,
  BACKWARD = -1,
}

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  public productListPagedCache = signal<ProductListEntryData[][]>([]);
  public currPageNumber = signal<number>(1);
  public currDisplayedProductList = computed<ProductListEntryData[]>(() => {
    return this.productListPagedCache()[this.currPageNumber() - 1] || [];
  });
  public retrievalError = signal<string | null>(null);

  constructor(private apiService: ApiService) {}

  public addNewProductBatchToCache(
    isInitialFetch: boolean = false,
    direction: DIRECTION = DIRECTION.FORWARD,
  ): void {
    const currPageToUse = isInitialFetch
      ? 1
      : this.currPageNumber() + direction;
    this.apiService
      .getProductListBatch(currPageToUse)
      .pipe(
        take(1),
        tap((newBatch) => {
          this.productListPagedCache.update((cache) => {
            if (direction === 1) {
              return [...cache, newBatch.products];
            } else {
              return [newBatch.products, ...cache];
            }
          });
          this.retrievalError.set(newBatch.error);
        }),
        filter((newBatch) => !!newBatch.error),
        tap(() => this.currPageNumber.set(currPageToUse)),
      )
      .subscribe();
  }

  public loadNextPage(): void {
    if (this.currPageNumber() < this.productListPagedCache().length) {
      this.addNewProductBatchToCache(false, 1);
    } else {
      this.currPageNumber.update((currPage) => DIRECTION.FORWARD);
    }
  }

  public loadPrevPage(): void {
    if (
      this.currPageNumber() > 1 &&
      this.productListPagedCache().length < this.currPageNumber()
    ) {
      this.addNewProductBatchToCache(false, DIRECTION.BACKWARD);
    } else {
      this.currPageNumber.update((currPage) => currPage - 1);
    }
  }

  public loadInitialProductList(): void {
    this.addNewProductBatchToCache(true);
  }
}
