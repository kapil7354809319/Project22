import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteCapacityTimeseriesComponent } from './route-capacity-timeseries.component';

describe('RouteCapacityTimeseriesComponent', () => {
  let component: RouteCapacityTimeseriesComponent;
  let fixture: ComponentFixture<RouteCapacityTimeseriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteCapacityTimeseriesComponent]
    });
    fixture = TestBed.createComponent(RouteCapacityTimeseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
