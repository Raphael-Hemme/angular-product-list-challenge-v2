import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, tap } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';
import { ProductDetailsService } from '../../../core/services/product-details/product-details.service';
import { ProductDetailsData } from '../../../core/services/api/api.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  public productId = signal<number | null>(null);
  public productDetails!: WritableSignal<ProductDetailsData | null>;

  private routeSub = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly headerService: HeaderService,
    private readonly productService: ProductDetailsService,
  ) {
    this.productDetails = this.productService.displayedProductDetails;
  }

  ngOnInit(): void {
    this.routeSub.add(
      this.route.queryParams
        .pipe(
          map((params) => (params['id'] ? +params['id'] : null)),
          tap((productId) => {
            this.productId.set(productId);
          }),
          // Todo: call product service to get product details (indirectly via cache or via API call) in switchMap then use product.title in the next tap.
          tap((productId) => {
            if (productId) {
              this.productService.loadProductDetails(productId);
            }
          }),
          tap(() => this.headerService.pageTitle.set('product details')),
          tap((productId) => {
            this.headerService.pageTitle.set('product details: ' + productId);
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
