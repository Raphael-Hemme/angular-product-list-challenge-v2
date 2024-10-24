import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import {
  ProductListService,
  TOTAL_REGULAR_PAGES
} from '../product-list/product-list.service';
import { ProductDetailsService } from '../product-details/product-details.service';

export const DEFAULT_PAGE_NUMBER = 1;

type MappedValuesForQueryParams = number | 'NOT_FOUND' | 'REDIRECT';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  public isOnSplashPage = signal(true);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productListService: ProductListService,
    private readonly productDetailsService: ProductDetailsService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event) => {
          this.isOnSplashPage.set(event.url === '/');
        })
      )
      .subscribe();
  }

  public handleQueryParamsForProductListPage(): Observable<number> {
    return this.route.queryParams.pipe(
      tap((params: Params) => {
        console.log(params);
        if (params['search']) {
          this.productListService.searchProducts(params['search']);
        }
      }),
      // prettier-ignore
      map((params): MappedValuesForQueryParams => this.mapPageQueryParams(params)),
      // prettier-ignore
      tap((mappedValues) => this.handleSideEffectsForPageQueryParams(mappedValues)),
      filter((mappedValues) => typeof mappedValues === 'number')
    );
  }

  public handleQueryParamsForProductDetailsPage(): Observable<number> {
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
      queryParams: { page: this.productListService.currSharedPageNumber() }
    });
    this.productDetailsService.clearDisplayedProductDetails();
  }

  public navigateToSearchUrl(searchTerm: string): void {
    this.router.navigate(['/products'], {
      queryParams: {
        page: 1,
        search: searchTerm
      }
    });
  }

  public resetUrlFromSearchToDefaultMode(): void {
    this.router.navigate(['/products'], {
      queryParams: {
        page: this.productListService.currSharedPageNumber()
      }
    });
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
    return pageNumber > 0 && pageNumber <= TOTAL_REGULAR_PAGES; // Todo: This needs to be changed into a dynamic value that also works with the actual lenght of e.g. the search result list
  }
}
