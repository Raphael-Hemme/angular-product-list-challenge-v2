import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ProductListEntryData } from '../../../core/services/api/api.service';
import { NgOptimizedImage } from '@angular/common';
import { SkeletonComponent } from '../../../core/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-list-entry',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, NgOptimizedImage, SkeletonComponent],
  templateUrl: './product-list-entry.component.html',
  styleUrl: './product-list-entry.component.scss'
})
export class ProductListEntryComponent {
  @Input() product!: ProductListEntryData;

  public readonly productDescriptionCutOff = 80;
}
