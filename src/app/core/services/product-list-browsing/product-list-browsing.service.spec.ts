import { TestBed } from '@angular/core/testing';

import { ProductListBrowsingService } from './product-list-browsing.service';

describe('ProductListBrowsingService', () => {
  let service: ProductListBrowsingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListBrowsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
