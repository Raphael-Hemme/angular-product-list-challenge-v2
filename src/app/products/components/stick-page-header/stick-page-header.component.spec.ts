import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickPageHeaderComponent } from './stick-page-header.component';

describe('StickPageHeaderComponent', () => {
  let component: StickPageHeaderComponent;
  let fixture: ComponentFixture<StickPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickPageHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
