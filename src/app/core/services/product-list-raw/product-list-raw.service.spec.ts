import { TestBed } from '@angular/core/testing';

import { ProductListRawService } from './product-list-raw.service';

describe('ProductListRawService', () => {
  let service: ProductListRawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListRawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
