import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  public pageTitle = signal<string>('');

  public hasSearchInput = computed<boolean>(
    () => this.pageTitle() === 'product list',
  );

  public hasPagination = computed<boolean>(
    () => this.pageTitle() === 'product list',
  );

  constructor() {}
}
