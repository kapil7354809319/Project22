import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptabReportComponent } from './captab-report.component';

describe('CaptabReportComponent', () => {
  let component: CaptabReportComponent;
  let fixture: ComponentFixture<CaptabReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptabReportComponent]
    });
    fixture = TestBed.createComponent(CaptabReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
