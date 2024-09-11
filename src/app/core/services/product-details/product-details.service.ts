import { Injectable, signal } from '@angular/core';
import {
  ApiService,
  ProductDetailsData,
  ProductListEntryData
} from '../api/api.service';
import { filter, take, tap } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  private productDetailsCache = signal<ProductDetailsData[]>([]);
  public displayedProductDetails = signal<ProductDetailsData | null>(null);
  public retrievalError = signal<string | null>(null);

  constructor(
    private readonly apiService: ApiService,
    private readonly loadingService: LoadingService
  ) {}

  private addNewProductDetailsToCache(productId: number): void {
    this.apiService
      .getProductDetails(productId)
      .pipe(
        take(1),
        tap((productDetailsResponse) => {
          const newDetails = this.getTypeSafeResonseDataOrDefault(
            productDetailsResponse.data
          );
          const error = productDetailsResponse.error;
          if (newDetails && !!!error) {
            this.productDetailsCache.update((cache) => [...cache, newDetails]);
          }
          this.retrievalError.set(productDetailsResponse.error);
        }),
        tap(() => this.loadingService.isLoadingProductDetails.set(false)),
        filter((productDetailsResponse) => !!!productDetailsResponse.error),
        tap((productDetailsResponse) =>
          this.displayedProductDetails.set(
            this.getTypeSafeResonseDataOrDefault(productDetailsResponse.data)
          )
        )
      )
      .subscribe();
  }

  public loadProductDetails(productId: number): void {
    this.loadingService.isLoadingProductDetails.set(true);
    const cachedProduct = this.productDetailsCache().filter(
      (product) => product.id === productId
    )[0];
    if (cachedProduct) {
      this.displayedProductDetails.set(cachedProduct);
      this.loadingService.isLoadingProductDetails.set(false);
    } else {
      this.addNewProductDetailsToCache(productId);
    }
  }

  public clearDisplayedProductDetails(): void {
    this.displayedProductDetails.set(null);
  }

  private getTypeSafeResonseDataOrDefault(
    internalResponseData: ProductListEntryData[] | ProductDetailsData | null
  ): ProductDetailsData | null {
    if (Array.isArray(internalResponseData) || internalResponseData === null) {
      return null;
    }
    return internalResponseData || null;
  }
}
