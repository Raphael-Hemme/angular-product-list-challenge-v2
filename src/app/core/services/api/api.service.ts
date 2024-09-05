import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export type ProductListEntryData = {
  id: number;
  title: string;
  brand: string;
  price: number;
  thumbnail: string;
};

export type ProductListResponse = {
  products: ProductListEntryData[];
  error: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://dummyjson.com/products';
  private defaultProductListFieldSelection = 'id,title,brand,price,thumbnail';

  constructor() {}

  public getProductListBatch(
    page: number,
    pageSize: number = 20,
    fieldSelection: string = this.defaultProductListFieldSelection,
  ): Observable<ProductListResponse> {
    const start = (page - 1) * pageSize;
    const url = `${this.baseUrl}?limit=${pageSize}&skip=${start}&select=${fieldSelection}`;

    const getFetchPromise = async (): Promise<ProductListResponse> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            'Failed to fetch product list.' +
              response.status +
              response.statusText,
          );
        } else {
          const data = await response.json();
          return {
            products: data.products,
            error: null,
          };
        }
      } catch (error) {
        return {
          products: [],
          error: this.getErrorMessage(error),
        };
      }
    };

    return from(getFetchPromise());
  }

  /**
   * Utility function by Kent C. Dodds to get error message from error object object if it actually
   * is an Error object otherwise stringify the 'error'.
   * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
   * @param error
   * @returns
   */
  public getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
