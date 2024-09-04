import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';

export type Product = {
  id: number;
  name: string;
  price: number;
};

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductListComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  public currProductList = signal<Product[]>([]);

  ngOnInit() {
    this.currProductList.set([
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 },
      { id: 3, name: 'Product 3', price: 300 },
    ]);
  }
}
