import { Component, Input, WritableSignal } from '@angular/core';
import { ProductListEntryData } from '../../../core/services/api/api.service';
import { ProductListEntryComponent } from '../product-list-entry/product-list-entry.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductListEntryComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  @Input() products!: WritableSignal<ProductListEntryData[]>;
}
