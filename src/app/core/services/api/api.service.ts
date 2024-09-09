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

    const getFetchPromise = async (): Promise<ProductListResponse> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            'Failed to fetch product list.' +
              response.status +
              response.statusText
          );
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
          error: this.getErrorMessage(error)
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
          throw new Error(
            'Failed to fetch product details.' +
              response.status +
              response.statusText
          );
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
          error: this.getErrorMessage(error)
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
          throw new Error(
            'Failed to fetch search results.' +
              response.status +
              response.statusText
          );
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
          error: this.getErrorMessage(error)
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
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
