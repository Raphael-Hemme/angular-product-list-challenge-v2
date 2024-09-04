import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-list-entry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './product-list-entry.component.html',
  styleUrl: './product-list-entry.component.scss',
})
export class ProductListEntryComponent {}
