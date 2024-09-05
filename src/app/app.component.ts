import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './products/components/header/header.component';
import { filter, tap } from 'rxjs';
import { HeaderService } from './core/services/header/header.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-product-list';

  // Todo: check if needed: Keeping the currRoute signal here for now to possibly use it later.
  private currRoute = signal<string>('');

  constructor(
    private router: Router,
    private headerService: HeaderService,
  ) {}

  ngOnInit() {
    // Long-lived subscription not cancelled because it should be active untill the app is destroyed
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => this.currRoute.set(event.url)),
        tap((event: NavigationEnd) =>
          this.headerService.currRoute.set(event.url),
        ),
      )
      .subscribe();
  }
}
