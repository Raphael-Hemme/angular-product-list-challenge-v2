import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal
} from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { ProductDetailsData } from '../../../core/services/api/api.service';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChip, MatButtonModule, NgOptimizedImage],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() productDetails!: WritableSignal<ProductDetailsData | null>;
  @Input() retrievalError!: WritableSignal<string | null>;

  public imageEdgeLength = this.getImageDimensions();

  private getImageDimensions(): number {
    //const isMobile = window.innerWidth <= 768;
    const windowDimensions = [
      Math.round(window.innerWidth),
      Math.round(window.innerHeight)
    ];

    return Math.round(Math.min(...windowDimensions) * 0.8);
  }
}
