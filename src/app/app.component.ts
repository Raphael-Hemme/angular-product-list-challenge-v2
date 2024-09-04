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

export type PageIdentifier = 'PRODUCT-LIST' | 'PRODUCT-DETAILS' | 'NOT-FOUND';

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

  private currRoute = signal<string>('');
  public currPage = computed<PageIdentifier>(() => {
    if (this.currRoute().includes('products')) {
      return 'PRODUCT-LIST';
    } else if (this.currRoute().includes('product')) {
      return 'PRODUCT-DETAILS';
    } else {
      return 'NOT-FOUND';
    }
  });

  constructor(private router: Router) {}

  ngOnInit() {
    // Long-lived subscription not cancelled because it should be active untill the app is destroyed
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => this.currRoute.set(event.url))
      )
      .subscribe();
  }
}
