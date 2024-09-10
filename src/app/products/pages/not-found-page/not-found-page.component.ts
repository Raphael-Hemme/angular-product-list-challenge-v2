import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ErrorUiComponent } from '../../../core/components/error-ui/error-ui.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorUiComponent, MatButtonModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {
  public errorMessage = signal<string>('404: Product not found');

  constructor(private readonly navigationServic: NavigationService) {}

  public navigateBackToProductList() {
    this.navigationServic.navigateBackToProductListPage();
  }
}
