import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductListEntryData } from '../../../core/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  private routeSub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currProductList.set([
      { id: 1, title: 'Product 1', brand: 'Test Brand', price: 100 },
      { id: 2, title: 'Product 2', brand: 'Test Brand', price: 200 },
      { id: 3, title: 'Product 3', brand: 'Test Brand', price: 300 },
      { id: 4, title: 'Product 4', brand: 'Test Brand', price: 100 },
      { id: 5, title: 'Product 5', brand: 'Test Brand', price: 200 },
      { id: 6, title: 'Product 6', brand: 'Test Brand', price: 300 },
      { id: 7, title: 'Product 7', brand: 'Test Brand', price: 100 },
      { id: 8, title: 'Product 8', brand: 'Test Brand', price: 200 },
      { id: 9, title: 'Product 9', brand: 'Test Brand', price: 300 },
      { id: 10, title: 'Product 10', brand: 'Test Brand', price: 100 },
      { id: 11, title: 'Product 11', brand: 'Test Brand', price: 100 },
      { id: 12, title: 'Product 12', brand: 'Test Brand', price: 200 },
      { id: 13, title: 'Product 13', brand: 'Test Brand', price: 300 },
      { id: 14, title: 'Product 14', brand: 'Test Brand', price: 100 },
      { id: 15, title: 'Product 15', brand: 'Test Brand', price: 200 },
      { id: 16, title: 'Product 16', brand: 'Test Brand', price: 300 },
      { id: 17, title: 'Product 17', brand: 'Test Brand', price: 100 },
      { id: 18, title: 'Product 18', brand: 'Test Brand', price: 200 },
      { id: 19, title: 'Product 19', brand: 'Test Brand', price: 300 },
      { id: 20, title: 'Product 20', brand: 'Test Brand', price: 300 },
    ]);

    this.routeSub.add(
      this.route.queryParams.subscribe((params) => {
        if (params['page']) {
          this.page.set(+params['page']);
        } else {
          // Navigate to the same route with the default query parameter
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: 1 },
            queryParamsHandling: 'merge', // Preserve other existing query params
          });
        }
      }),
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
