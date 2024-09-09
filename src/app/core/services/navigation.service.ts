import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import {
  ProductListService,
  TOTAL_REGULAR_PAGES
} from './product-list/product-list.service';
import { ProductDetailsService } from './product-details/product-details.service';

export const DEFAULT_PAGE_NUMBER = 1;

type MappedValuesForQueryParams = number | 'NOT_FOUND' | 'REDIRECT';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productListService: ProductListService,
    private readonly productDetailsService: ProductDetailsService
  ) {}

  public handlePageQueryParams(): Observable<number> {
    return this.route.queryParams.pipe(
      // prettier-ignore
      map((params): MappedValuesForQueryParams => this.mapPageQueryParams(params)),
      // prettier-ignore
      tap((mappedValues) => this.handleSideEffectsForPageQueryParams(mappedValues)),
      filter((mappedValues) => typeof mappedValues === 'number')
    );
  }

  public handleProductIdQueryParams(): Observable<number> {
    return this.route.queryParams.pipe(
      map((params: Params) => (params['id'] ? +params['id'] : null)),
      tap((productId) => {
        if (!productId) {
          this.router.navigate(['/404']);
        }
      }),
      filter((productId) => typeof productId === 'number')
    );
  }

  public navigateBackToProductListPage(): void {
    this.router.navigate(['/products'], {
      queryParams: { page: this.productListService.currRegularPageNumber() }
    });
    this.productDetailsService.clearDisplayedProductDetails();
  }

  private handleSideEffectsForPageQueryParams(
    mappedValues: MappedValuesForQueryParams
  ): void {
    switch (mappedValues) {
      case 'REDIRECT':
        this.redirectToProductListWithQueryParams();
        break;
      case 'NOT_FOUND':
        this.router.navigate(['/404']);
        break;
      default:
        return;
    }
  }

  private mapPageQueryParams(params: Params): MappedValuesForQueryParams {
    if (params['page'] && this.pageNumberIsValid(+params['page'])) {
      return +params['page'];
    } else if (!params['page']) {
      return 'REDIRECT';
    } else {
      return 'NOT_FOUND';
    }
  }

  private redirectToProductListWithQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: DEFAULT_PAGE_NUMBER }
    });
  }

  private pageNumberIsValid(pageNumber: number): boolean {
    return pageNumber > 0 && pageNumber <= TOTAL_REGULAR_PAGES;
  }
}
