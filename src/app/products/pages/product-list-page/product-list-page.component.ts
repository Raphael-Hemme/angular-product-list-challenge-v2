import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  OnInit,
  Signal,
  signal
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ProductListEntryData } from '../../../core/services/api/api.service';
import { ProductListService } from '../../../core/services/product-list/product-list.service';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { LoadingSpinnerComponent } from '../../../core/components/loading-spinner/loading-spinner.component';
import { ErrorUiComponent } from '../../../core/components/error-ui/error-ui.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProductListComponent,
    SearchFormComponent,
    PaginatorComponent,
    LoadingSpinnerComponent,
    ErrorUiComponent
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss'
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  public pageNumber = signal<number>(1);
  public currProductList!: Signal<ProductListEntryData[]>;
  public errorMsg!: Signal<null | string>;
  public isLoading!: Signal<boolean>;
  public didRetryLoading = false;

  private pageQueryParamsSub = new Subscription();

  constructor(
    private readonly productListServece: ProductListService,
    private readonly navigationService: NavigationService,
    private readonly loadingService: LoadingService
  ) {
    this.currProductList = this.productListServece.currDisplayedProductList;
    this.errorMsg = this.productListServece.retrievalError;
    this.isLoading = computed(() => {
      return (
        this.loadingService.isLoadingRegularList() ||
        this.loadingService.isLoadingSearchResults()
      );
    });
  }

  ngOnInit() {
    this.pageQueryParamsSub.add(
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
    this.pageQueryParamsSub.unsubscribe();
  }

  public retryLoadingProducts(): void {
    if (!this.didRetryLoading) {
      this.productListServece.loadPage(this.pageNumber());
    }
  }
}
