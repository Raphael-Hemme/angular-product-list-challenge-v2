import { Component, Input, WritableSignal } from '@angular/core';
import { Product } from '../../pages/product-list-page/product-list-page.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  @Input() products!: WritableSignal<Product[]>;
}
