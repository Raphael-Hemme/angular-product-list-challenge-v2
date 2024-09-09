import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { ProductDetailsService } from '../../../core/services/product-details/product-details.service';
import { ProductDetailsData } from '../../../core/services/api/api.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { LoadingSpinnerComponent } from '../../../core/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, ProductDetailsComponent, LoadingSpinnerComponent],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  public productId = signal<number | null>(null);
  public productDetails!: WritableSignal<ProductDetailsData | null>;
  public retrievalError!: WritableSignal<string | null>;

  public didRetryLoading = false;

  private productIdQueryParamSub = new Subscription();

  constructor(
    private readonly productDetailsService: ProductDetailsService,
    private readonly navigationService: NavigationService
  ) {
    this.productDetails = this.productDetailsService.displayedProductDetails;
    this.retrievalError = this.productDetailsService.retrievalError;
  }

  ngOnInit(): void {
    this.productIdQueryParamSub.add(
      this.navigationService
        .handleProductIdQueryParams()
        .pipe(
          tap((productId) => this.productId.set(productId)),
          // prettier-ignore
          tap((productId) => this.productDetailsService.loadProductDetails(productId))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.productIdQueryParamSub.unsubscribe();
  }

  public navigateBackToProductListPage(): void {
    this.navigationService.navigateBackToProductListPage();
  }

  public retryLoadingProductDetails(): void {
    const productId = this.productId();
    if (typeof productId === 'number' && !this.didRetryLoading) {
      this.productDetailsService.loadProductDetails(productId);
    }
    this.didRetryLoading = true;
  }
}
