import { Injectable, signal } from '@angular/core';
import { ApiService, ProductListEntryData } from '../api/api.service';
import {
  generateInitiallyEmptyProductListCache,
  getTypeSafeResponseDataOrDefault
} from '../../utils/product-list-utils';
import { filter, take, tap } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListRawService {
  public currRawPageNumber = signal<number>(1);
  public productListPagedCache = signal<ProductListEntryData[][]>(
    generateInitiallyEmptyProductListCache()
  );

  public retrievalError = signal<string | null>(null);

  constructor(
    private readonly apiService: ApiService,
    private readonly loadingService: LoadingService
  ) {}

  private addNewProductBatchToCache(forPageNumber: number): void {
    const insertIndex = forPageNumber - 1;

    this.apiService
      .getProductListBatch(forPageNumber)
      .pipe(
        take(1),
        tap((newBatch) => {
          this.productListPagedCache.update((cache) => {
            const newCacheState = [...cache];
            newCacheState[insertIndex] = getTypeSafeResponseDataOrDefault(
              newBatch.data
            );
            return newCacheState;
          });
          this.retrievalError.set(newBatch.error);
        }),
        tap(() => this.loadingService.isLoadingRegularList.set(false)),
        filter((newBatch) => !!!newBatch.error),
        tap(() => this.currRawPageNumber.set(forPageNumber))
      )
      .subscribe();
  }

  public loadPage(pageNumber: number): void {
    this.loadingService.isLoadingRegularList.set(true);
    if (this.productListPagedCache()[pageNumber - 1].length === 0) {
      this.addNewProductBatchToCache(pageNumber);
    } else {
      this.currRawPageNumber.set(pageNumber);
      this.loadingService.isLoadingRegularList.set(false);
    }
  }
}
