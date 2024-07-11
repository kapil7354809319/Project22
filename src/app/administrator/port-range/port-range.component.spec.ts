import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortRangeComponent } from './port-range.component';

describe('PortRangeComponent', () => {
  let component: PortRangeComponent;
  let fixture: ComponentFixture<PortRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortRangeComponent]
    });
    fixture = TestBed.createComponent(PortRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
