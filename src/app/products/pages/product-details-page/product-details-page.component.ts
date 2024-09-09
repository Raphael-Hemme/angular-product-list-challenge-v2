import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { ProductDetailsService } from '../../../core/services/product-details/product-details.service';
import { ProductDetailsData } from '../../../core/services/api/api.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, ProductDetailsComponent],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss'
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  public productId = signal<number | null>(null);
  public productDetails!: WritableSignal<ProductDetailsData | null>;

  private productIdQueryParamSub = new Subscription();

  constructor(
    private readonly headerService: HeaderService,
    private readonly productDetailsService: ProductDetailsService,
    private readonly navigationService: NavigationService
  ) {
    this.productDetails = this.productDetailsService.displayedProductDetails;
  }

  ngOnInit(): void {
    this.productIdQueryParamSub.add(
      this.navigationService
        .handleProductIdQueryParams()
        .pipe(
          // prettier-ignore
          tap((productId) => this.productDetailsService.loadProductDetails(productId)),
          // prettier-ignore
          tap(() => this.headerService.pageTitle.set('product details'))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.productIdQueryParamSub.unsubscribe();
  }
}
