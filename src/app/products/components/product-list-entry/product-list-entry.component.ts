import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ProductListEntryData } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-product-list-entry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  templateUrl: './product-list-entry.component.html',
  styleUrl: './product-list-entry.component.scss',
})
export class ProductListEntryComponent {
  @Input() product!: ProductListEntryData;
}
