import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stick-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './stick-page-header.component.html',
  styleUrl: './stick-page-header.component.scss',
})
export class StickPageHeaderComponent {}
