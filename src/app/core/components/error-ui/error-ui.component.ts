import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  Signal
} from '@angular/core';

type ErrorDomain =
  | 'PRODUCT DETAILS ERROR'
  | 'PRODUCT LIST ERROR'
  | 'PRODUCT SEARCH ERROR'
  | 'UNKNOWN ERROR';

@Component({
  selector: 'app-error-ui',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './error-ui.component.html',
  styleUrl: './error-ui.component.scss'
})
export class ErrorUiComponent {
  @Input() errorMessage!: Signal<string | null>;
  public errorDomain = computed<string | null>(() => {
    return this.errorMessage()?.split(':')[0] ?? null;
  });
}
