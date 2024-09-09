import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  signal
} from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductListEntryData } from '../../../core/services/api/api.service';
import { Subscription, tap } from 'rxjs';
import { ProductListService } from '../../../core/services/product-list/product-list.service';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductListComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss'
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  public pageNumber = signal<number>(1);
  public currProductList!: Signal<ProductListEntryData[]>;

  private routeSub = new Subscription();

  constructor(
    private productListServece: ProductListService,
    private navigationService: NavigationService
  ) {
    this.currProductList = this.productListServece.currDisplayedProductList;
  }

  ngOnInit() {
    this.routeSub.add(
      this.navigationService
        .handlePageQueryParams()
        .pipe(
          tap((pageNumber) => {
            this.pageNumber.set(pageNumber);
            this.productListServece.loadPage(this.pageNumber());
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
