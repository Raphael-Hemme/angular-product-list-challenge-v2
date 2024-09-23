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
import { SkeletonComponent } from '../../../core/components/skeleton/skeleton.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChip, MatButtonModule, NgOptimizedImage, SkeletonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() productDetails!: WritableSignal<ProductDetailsData | null>;
  @Input() retrievalError!: WritableSignal<string | null>;

  public imageEdgeLength = this.getImageDimensions();
  public skeletonWidth = `${this.imageEdgeLength}px`;
  public skeletonHeight = `${this.imageEdgeLength}px`;

  private getImageDimensions(): number {
    const windowDimensions = [
      Math.round(window.innerWidth),
      Math.round(window.innerHeight)
    ];

    // If the window dimensions are not available, default to 400px
    if (
      windowDimensions.length === 0 ||
      windowDimensions.some((dim) => dim <= 0) ||
      windowDimensions.some((dim) => isNaN(dim))
    ) {
      return 400;
    }

    return Math.round(Math.min(...windowDimensions) * 0.8);
  }
}
