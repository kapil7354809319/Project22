import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortReportComponent } from './port-report.component';

describe('PortReportComponent', () => {
  let component: PortReportComponent;
  let fixture: ComponentFixture<PortReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortReportComponent]
    });
    fixture = TestBed.createComponent(PortReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
