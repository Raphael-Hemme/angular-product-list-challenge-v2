import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  Signal,
} from '@angular/core';
import { PageIdentifier } from '../../../app.component';
import { SearchFormComponent } from '../search-form/search-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() currPage!: Signal<PageIdentifier>;

  public pageTitle = computed<string>(() => {
    return this.currPage().toLowerCase();
  });
}
