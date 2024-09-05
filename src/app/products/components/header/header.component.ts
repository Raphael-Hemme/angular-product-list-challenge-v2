import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { SearchFormComponent } from '../search-form/search-form.component';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // I'm using references to the signals from the header service here to avoid accessing the service directly in the template.
  public pageTitle!: Signal<string>;
  public hasSearchInput!: Signal<boolean>;
  public hasPagination!: Signal<boolean>;
  public productDetailsTitle!: Signal<null | string>;

  constructor(private headerService: HeaderService) {
    this.pageTitle = this.headerService.pageTitle;
    this.hasSearchInput = this.headerService.hasSearchInput;
    this.hasPagination = this.headerService.hasPagination;
    this.productDetailsTitle = this.headerService.productDetailsTitle;
  }
}
