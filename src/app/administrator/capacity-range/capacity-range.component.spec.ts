import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityRangeComponent } from './capacity-range.component';

describe('CapacityRangeComponent', () => {
  let component: CapacityRangeComponent;
  let fixture: ComponentFixture<CapacityRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapacityRangeComponent]
    });
    fixture = TestBed.createComponent(CapacityRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
