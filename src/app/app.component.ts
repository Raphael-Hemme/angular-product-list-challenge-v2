import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { NavigationService } from './core/services/navigation/navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title = 'angular-product-list';
  public isOnSplashPage!: WritableSignal<boolean>;

  constructor(private navigationService: NavigationService) {
    this.isOnSplashPage = this.navigationService.isOnSplashPage;
  }
}
