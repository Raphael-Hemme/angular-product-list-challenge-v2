import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal,
} from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { ProductDetailsData } from '../../../core/services/api/api.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChip],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  @Input() productDetails!: WritableSignal<ProductDetailsData | null>;
}
