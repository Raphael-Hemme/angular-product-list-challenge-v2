import { Injectable, signal } from '@angular/core';
import { ApiService, ProductDetailsData } from '../api/api.service';
import { filter, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  private productDetailsCache = signal<ProductDetailsData[]>([]);
  public displayedProductDetails = signal<ProductDetailsData | null>(null);
  public retrievalError = signal<string | null>(null);

  constructor(private readonly apiService: ApiService) {}

  private addNewProductDetailsToCache(productId: number): void {
    this.apiService
      .getProductDetails(productId)
      .pipe(
        take(1),
        tap((productDetailsResponse) => {
          const newDetails = productDetailsResponse.product;
          const error = productDetailsResponse.error;
          if (newDetails && !!!error) {
            this.productDetailsCache.update((cache) => [...cache, newDetails]);
          }
          this.retrievalError.set(productDetailsResponse.error);
          console.log('productDetailsResponse: ', productDetailsResponse);
        }),
        filter((productDetailsResponse) => !!!productDetailsResponse.error),
        tap((productDetailsResponse) =>
          this.displayedProductDetails.set(productDetailsResponse.product)
        ),
        tap(() => console.log(this.productDetailsCache())) // Todo: remove dev logging
      )
      .subscribe();
  }

  public loadProductDetails(productId: number): void {
    const cachedProduct = this.productDetailsCache().filter(
      (product) => product.id === productId
    )[0];
    if (cachedProduct) {
      this.displayedProductDetails.set(cachedProduct);
    } else {
      this.addNewProductDetailsToCache(productId);
    }
  }

  public clearDisplayedProductDetails(): void {
    this.displayedProductDetails.set(null);
  }
}
