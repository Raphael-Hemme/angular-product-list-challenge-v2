import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export type ProductListEntryData = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  description: string;
  thumbnail: string;
};

export type ProductListResponse = {
  products: ProductListEntryData[];
  error: string | null;
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

export type ProductDetailsResponse = {
  product: ProductDetailsData | null;
  error: string | null;
};

type ProductDomain =
  | 'PRODUCT LIST'
  | 'PRODUCT DETAILS'
  | 'PRODUCT SEARCH'
  | 'UNKNOWN';

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
  ): Observable<ProductListResponse> {
    const start = (page - 1) * pageSize;
    const url = `${BASE_URL}?limit=${pageSize}&skip=${start}&select=${fieldSelection}`;

    // Todo: Refactor the three nested getFetchPromise functions into a single possibly generic function.
    const getFetchPromise = async (): Promise<ProductListResponse> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(this.constructErrorStringFromResponse(response));
        } else {
          const data = await response.json();
          return {
            products: data.products,
            error: null
          };
        }
      } catch (error) {
        return {
          products: [],
          error: this.prependErrorDomainToErrorMessage(
            'PRODUCT LIST',
            this.getErrorMessage(error)
          )
        };
      }
    };

    return from(getFetchPromise());
  }

  public getProductDetails(
    productId: number,
    fieldSelection: string = DEFAULT_PRODUCT_DETAILS_FIELD_SELECTION
  ): Observable<ProductDetailsResponse> {
    const url = `${BASE_URL}/${productId}?select=${fieldSelection}`;

    const getFetchPromise = async (): Promise<ProductDetailsResponse> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(this.constructErrorStringFromResponse(response));
        } else {
          const data = await response.json();
          return {
            product: data,
            error: null
          };
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        return {
          product: null,
          error: this.prependErrorDomainToErrorMessage(
            'PRODUCT DETAILS',
            this.getErrorMessage(error)
          )
        };
      }
    };

    return from(getFetchPromise());
  }

  public searchProducts(
    searchQuery: string,
    fieldSelection: string = DEFAULT_PRODUCT_LIST_FIELD_SELECTION
  ): Observable<ProductListResponse> {
    const url = `${BASE_URL}/search?q=${searchQuery}&select=${fieldSelection}`;

    const getFetchPromise = async (): Promise<ProductListResponse> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(this.constructErrorStringFromResponse(response));
        } else {
          const data = await response.json();
          return {
            products: data.products,
            error: null
          };
        }
      } catch (error) {
        return {
          products: [],
          error: this.prependErrorDomainToErrorMessage(
            'PRODUCT SEARCH',
            this.getErrorMessage(error)
          )
        };
      }
    };

    return from(getFetchPromise());
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

  private getErrorCause(error: Error): string {
    if (!navigator.onLine && error.message === 'Failed to fetch') {
      return 'You are offline. Please check your internet connection.';
    } else if (error.cause) {
      return String(error.cause);
    } else {
      return 'The cause of this error is unknown.';
    }
  }

  private constructErrorStringFromResponse(
    response: Response | null = null
  ): string {
    return [response?.status ?? null, response?.statusText ?? null]
      .filter((el) => el)
      .join(' ');
  }

  private prependErrorDomainToErrorMessage(
    domain: ProductDomain,
    error: string
  ): string {
    return `${domain} ERROR: Failed to fetch ${domain.toLowerCase()}.
            ${error}`;
  }
}
