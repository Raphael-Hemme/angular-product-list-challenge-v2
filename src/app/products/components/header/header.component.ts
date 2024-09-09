import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HeaderService } from '../../../core/services/header/header.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { NavigationService } from '../../../core/services/navigation.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchFormComponent, PaginatorComponent, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // I'm using references to the signals from the header service here to avoid accessing the service directly in the template.
  public pageTitle!: Signal<string>;
  public hasSearchInput!: Signal<boolean>;
  public hasPagination!: Signal<boolean>;

  constructor(
    private readonly headerService: HeaderService,
    private readonly navigationService: NavigationService
  ) {
    this.pageTitle = this.headerService.pageTitle;
    this.hasSearchInput = this.headerService.hasSearchInput;
    this.hasPagination = this.headerService.hasPagination;
  }
}
