import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal
} from '@angular/core';

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
}
