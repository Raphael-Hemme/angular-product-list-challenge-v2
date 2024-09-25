import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';

export type ProductListEntryData = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  description: string;
  thumbnail: string;
};

export type ProductDetailsData = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  description: string;
  thumbnail: string;
  images: string[];
  category: string;
  tags: string[];
  availabilityStatus: string;
};

export type InternalResponseWrapper = {
  data: ProductListEntryData[] | ProductDetailsData | null;
  error: string | null;
};

type ValidProductListResponseData = {
  products: ProductListEntryData[];
};

type ValidProductDetailsResponseData = ProductDetailsData;

type ProductDomain = 'PRODUCT LIST' | 'PRODUCT DETAILS' | 'PRODUCT SEARCH';

export const BASE_URL = 'https://dummyjson.com/products';

export const DEFAULT_PRODUCT_LIST_FIELD_SELECTION =
  'id,title,brand,price,description,thumbnail';

export const DEFAULT_PRODUCT_DETAILS_FIELD_SELECTION =
  'id,title,brand,price,description,thumbnail,images,category,tags,availabilityStatus';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() {}

  public getProductListBatch(
    page: number,
    pageSize: number = 20,
    fieldSelection: string = DEFAULT_PRODUCT_LIST_FIELD_SELECTION
  ): Observable<InternalResponseWrapper> {
    const start = (page - 1) * pageSize;
    const url = `${BASE_URL}?limit=${pageSize}&skip=${start}&select=${fieldSelection}`;

    return this.getQueryObservable(url, 'PRODUCT LIST');
  }

  public getProductDetails(
    productId: number,
    fieldSelection: string = DEFAULT_PRODUCT_DETAILS_FIELD_SELECTION
  ): Observable<InternalResponseWrapper> {
    const url = `${BASE_URL}/${productId}?select=${fieldSelection}`;

    return this.getQueryObservable(url, 'PRODUCT DETAILS');
  }

  public searchProducts(
    searchQuery: string,
    fieldSelection: string = DEFAULT_PRODUCT_LIST_FIELD_SELECTION
  ): Observable<InternalResponseWrapper> {
    const url = `${BASE_URL}/search?q=${searchQuery}&select=${fieldSelection}`;
    return this.getQueryObservable(url, 'PRODUCT SEARCH');
  }

  /**
   * Utility function adapted from Kent C. Dodds to get error message from error object object if it actually
   * is an Error object otherwise stringify the 'error'.
   * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
   * @param error
   * @returns
   */
  public getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      const { message, cause } = error;
      const moreHelpfulCause = this.getErrorCause(error);

      return message === 'Failed to fetch'
        ? moreHelpfulCause
        : message + (cause ?? '');
    } else {
      return String(error);
    }
  }

  private getQueryObservable(
    url: string,
    query: ProductDomain
  ): Observable<InternalResponseWrapper> {
    return from(this.getFetchPromise(url)).pipe(
      // take(1),
      // prettier-ignore
      map((responseData) => this.handleUnknownResponseData(responseData, query)),
      catchError((error) => {
        return of({
          data: [] as ProductListEntryData[],
          error: this.prependErrorDomainToErrorMessage(
            query,
            this.getErrorMessage(error)
          )
        });
      })
    );
  }

  private handleUnknownResponseData(
    responseData: unknown,
    query: ProductDomain
  ): InternalResponseWrapper {
    if (this.isValidProductDetailsData(responseData)) {
      // prettier-ignore
      const data = this.extractValidResponseData(responseData, query) as ProductDetailsData;
      return {
        data,
        error: null
      };
    } else if (this.isValidProductListData(responseData)) {
      // prettier-ignore
      const data = this.extractValidResponseData(responseData, query) as ProductListEntryData[];
      return {
        data,
        error: null
      };
    } else {
      throw new Error(this.getErrorMessage(responseData));
    }
  }

  private extractValidResponseData(
    responseData:
      | ValidProductDetailsResponseData
      | ValidProductListResponseData,
    query: ProductDomain
  ): ProductDetailsData | ProductListEntryData[] {
    if (query === 'PRODUCT SEARCH' || query === 'PRODUCT LIST') {
      // prettier-ignore
      return (responseData as ValidProductListResponseData).products as ProductListEntryData[];
    } else {
      return responseData as ProductDetailsData;
    }
  }

  private isValidProductDetailsData(
    data: any
  ): data is ValidProductDetailsResponseData {
    return !(
      !data ||
      Object.hasOwn(data, 'message') ||
      data instanceof Error ||
      Array.isArray(data)
    );
  }

  private isValidProductListData(
    data: any
  ): data is ValidProductListResponseData {
    return !(
      !data ||
      Object.hasOwn(data, 'message') ||
      data instanceof Error ||
      !Object.hasOwn(data, 'products')
    );
  }

  private async getFetchPromise<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return await response.json();
  }

  private getErrorCause(error: Error): string {
    if (!navigator.onLine && error.message === 'Failed to fetch') {
      return 'You are offline. Please check your internet connection.';
    } else if (error.cause) {
      return String(error.cause);
    } else {
      return 'The cause of this error is unknown.';
    }
  }

  private prependErrorDomainToErrorMessage(
    domain: ProductDomain,
    error: string
  ): string {
    return `${domain} ERROR: Failed to fetch ${domain.toLowerCase()}.
            ${error}`;
  }
}
