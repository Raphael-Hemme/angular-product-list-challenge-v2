import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchFormComponent } from '../../../products/components/search-form/search-form.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-splash-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchFormComponent, MatButtonModule, RouterLink],
  templateUrl: './splash-page.component.html',
  styleUrl: './splash-page.component.scss'
})
export class SplashPageComponent {}
