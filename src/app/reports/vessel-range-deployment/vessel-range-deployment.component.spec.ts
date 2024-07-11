import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselRangeDeploymentComponent } from './vessel-range-deployment.component';

describe('VesselRangeDeploymentComponent', () => {
  let component: VesselRangeDeploymentComponent;
  let fixture: ComponentFixture<VesselRangeDeploymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VesselRangeDeploymentComponent]
    });
    fixture = TestBed.createComponent(VesselRangeDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
