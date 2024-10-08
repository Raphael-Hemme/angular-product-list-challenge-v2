import {
  ChangeDetectionStrategy,
  Component,
  Input,
  WritableSignal
} from '@angular/core';
import { ProductDetailsData } from '../../../core/services/api/api.service';
import { NgOptimizedImage } from '@angular/common';
import { SkeletonComponent } from '../../../core/components/skeleton/skeleton.component';

const defaultEdgeLength = 400;

@Component({
  selector: 'app-product-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, SkeletonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  @Input() productDetails!: WritableSignal<ProductDetailsData | null>;
  @Input() retrievalError!: WritableSignal<string | null>;

  public imageEdgeLength = this.getImageDimensions();
  public skeletonWidth = `${this.imageEdgeLength}px`;
  public skeletonHeight = `${this.imageEdgeLength}px`;

  /**
   * Calculates the dimensions for an image based on the current window size to make sure it fits both on mobile and desktop.
   *
   * @returns {number} The smaller of the window's width or height, multiplied by 0.8.
   * If the window dimensions are not available or invalid, returns a default edge length.
   */
  private getImageDimensions(): number {
    // Get the window dimensions
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
      return defaultEdgeLength;
    }

    // Return the smaller of the two dimensions, multiplied by 0.8 to make sure the image fits both on mobile and desktop
    return Math.round(Math.min(...windowDimensions) * 0.8);
  }
}
