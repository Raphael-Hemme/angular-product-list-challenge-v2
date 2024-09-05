import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductListEntryData } from '../../../core/services/api/api.service';
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
  public page = signal<number>(1);
  public currProductList!: Signal<ProductListEntryData[]>;

  private routeSub = new Subscription();
  private defaultPage = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private productListServece: ProductListService,
  ) {
    this.currProductList = this.productListServece.currDisplayedProductList;
  }

  ngOnInit() {
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
