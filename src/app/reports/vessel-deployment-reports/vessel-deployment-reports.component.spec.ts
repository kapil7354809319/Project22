import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselDeploymentReportsComponent } from './vessel-deployment-reports.component';

describe('VesselDeploymentReportsComponent', () => {
  let component: VesselDeploymentReportsComponent;
  let fixture: ComponentFixture<VesselDeploymentReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VesselDeploymentReportsComponent]
    });
    fixture = TestBed.createComponent(VesselDeploymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
