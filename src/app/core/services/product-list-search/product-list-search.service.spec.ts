import { TestBed } from '@angular/core/testing';

import { ProductListSearchService } from './product-list-search.service';

describe('ProductListSearchService', () => {
  let service: ProductListSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
