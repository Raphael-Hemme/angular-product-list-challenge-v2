import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import {
  ApiService,
  ProductListEntryData,
} from '../../../core/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { ProductListService } from '../../../core/services/product-list/product-list.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductListComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  public currProductList = signal<ProductListEntryData[]>([]);

  public page = signal<number>(1);
  public testProducts!: Signal<ProductListEntryData[]>;

  private routeSub = new Subscription();
  private defaultPage = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private productListServece: ProductListService,
  ) {
    this.testProducts = this.productListServece.currDisplayedProductList;
  }

  ngOnInit() {
    this.currProductList.set([
      {
        id: 1,
        title: 'Product 1',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 2,
        title: 'Product 2',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 3,
        title: 'Product 3',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 4,
        title: 'Product 4',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 5,
        title: 'Product 5',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 6,
        title: 'Product 6',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 7,
        title: 'Product 7',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 8,
        title: 'Product 8',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 9,
        title: 'Product 9',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 10,
        title: 'Product 10',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 11,
        title: 'Product 11',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 12,
        title: 'Product 12',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 13,
        title: 'Product 13',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 14,
        title: 'Product 14',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 15,
        title: 'Product 15',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 16,
        title: 'Product 16',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 17,
        title: 'Product 17',
        brand: 'Test Brand',
        price: 100,
        thumbnail: 'some string',
      },
      {
        id: 18,
        title: 'Product 18',
        brand: 'Test Brand',
        price: 200,
        thumbnail: 'some string',
      },
      {
        id: 19,
        title: 'Product 19',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
      {
        id: 20,
        title: 'Product 20',
        brand: 'Test Brand',
        price: 300,
        thumbnail: 'some string',
      },
    ]);

    this.routeSub.add(
      this.route.queryParams
        .pipe(
          tap((params) => {
            if (params['page']) {
              this.page.set(+params['page']);
            } else {
              this.redirectToProductListWithQueryParams();
            }
          }),
          tap(() => this.headerService.pageTitle.set('Product List')),
        )
        .subscribe(),
    );

    this.productListServece.loadInitialProductList();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private redirectToProductListWithQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.defaultPage },
    });
  }
}
