import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentVesselReportComponent } from './current-vessel-report.component';

describe('CurrentVesselReportComponent', () => {
  let component: CurrentVesselReportComponent;
  let fixture: ComponentFixture<CurrentVesselReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentVesselReportComponent]
    });
    fixture = TestBed.createComponent(CurrentVesselReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
