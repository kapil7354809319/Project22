import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselHistoryReportComponent } from './VesselHistoryReportComponent';

describe('VesselHistoryReportComponent', () => {
  let component: VesselHistoryReportComponent;
  let fixture: ComponentFixture<VesselHistoryReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VesselHistoryReportComponent]
    });
    fixture = TestBed.createComponent(VesselHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
