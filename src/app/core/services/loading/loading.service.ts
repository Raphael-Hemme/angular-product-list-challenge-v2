import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoadingRegularList = signal<boolean>(false);
  public isLoadingProductDetails = signal<boolean>(false);
  public isLoadingSearchResults = signal<boolean>(false);

  constructor() {}
}
