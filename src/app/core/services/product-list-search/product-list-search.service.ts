import { Injectable, signal } from '@angular/core';
import { PRODUCT_LIST_PAGE_SIZE } from '../product-list/product-list.service';
import { ApiService, ProductListEntryData } from '../api/api.service';
import { take, tap } from 'rxjs';
import { getTypeSafeResponseDataOrDefault } from '../../utils/product-list-utils';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListSearchService {
  public currSearchTerm = signal<string>('');
  public searchResults = signal<ProductListEntryData[][]>([[]]);
  public currSearchPageNumber = signal<number>(1);

  public retrievalError = signal<string | null>(null);

  constructor(
    private readonly apiService: ApiService,
    private readonly loadingService: LoadingService
  ) {}

  public searchProducts(searchTerm: string): void {
    this.currSearchTerm.update((prevSearchTerm: string) => {
      if ((!prevSearchTerm && searchTerm) || prevSearchTerm !== searchTerm) {
        console.log('returning searchTerm: ', searchTerm);
        return searchTerm;
      } else {
        console.log('returning prevSearchTerm: ', prevSearchTerm);
        return prevSearchTerm;
      }
    });
    this.loadingService.isLoadingSearchResults.set(true);
    this.apiService
      .searchProducts(searchTerm)
      .pipe(
        take(1),
        tap((searchResults) => {
          const chunkedArr = this.chunkSearchResultsIntoPages(
            getTypeSafeResponseDataOrDefault(searchResults.data)
          );
          this.searchResults.set(chunkedArr);
          this.retrievalError.set(searchResults.error);
        }),
        tap(() => this.loadingService.isLoadingSearchResults.set(false))
      )
      .subscribe();
  }

  public clearSearchResults(): void {
    this.currSearchTerm.set('');
    this.searchResults.set([[]]);
    this.retrievalError.set(null);
    this.currSearchPageNumber.set(1);
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
}
