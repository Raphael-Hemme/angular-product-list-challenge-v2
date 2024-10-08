import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ErrorUiComponent } from '../../../core/components/error-ui/error-ui.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorUiComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss'
})
export class NotFoundPageComponent {
  public errorMessage = signal<string>(
    '404: Product or Page could not be found'
  );

  constructor(private readonly navigationServic: NavigationService) {}

  public navigateBackToProductList() {
    this.navigationServic.navigateBackToProductListPage();
  }
}
