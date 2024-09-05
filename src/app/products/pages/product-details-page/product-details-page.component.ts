import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit, OnDestroy {
  public productId = signal<number | null>(null);

  private routeSub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
  ) {}

  ngOnInit(): void {
    this.routeSub.add(
      this.route.queryParams
        .pipe(
          tap((params) => {
            this.productId.set(params['id'] ? +params['id'] : null);
          }),
          // Todo: call product service to get product details (indirectly via cache or via API call) in switchMap then use product.title in the next tap.
          tap((params) => {
            this.headerService.pageTitle.set(
              'Product Details: ' + params['id'],
            );
          }),
        )
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
