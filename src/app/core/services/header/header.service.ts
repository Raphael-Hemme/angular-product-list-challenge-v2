import { computed, Injectable, signal } from '@angular/core';

export type PageIdentifier = 'PRODUCT_LIST' | 'PRODUCT_DETAILS' | 'NOT_FOUND';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public currRoute = signal<string>('');
  public pageIdentifier = computed<PageIdentifier>(() => {
    if (this.currRoute() === '/' || this.currRoute().includes('products')) {
      return 'PRODUCT_LIST';
    } else if (this.currRoute().includes('product')) {
      return 'PRODUCT_DETAILS';
    } else {
      return 'NOT_FOUND';
    }
  });

  public pageTitle = computed<string>(() => {
    switch (this.pageIdentifier()) {
      case 'PRODUCT_LIST':
        return 'Product List';
      case 'PRODUCT_DETAILS':
        return 'Product Details';
      default:
        return 'Error';
    }
  });

  public productDetailsTitle = signal<string | null>(null);

  public hasSearchInput = computed<boolean>(
    () => this.pageIdentifier() === 'PRODUCT_LIST',
  );

  public hasPagination = computed<boolean>(
    () => this.pageIdentifier() === 'PRODUCT_LIST',
  );

  constructor() {}
}
