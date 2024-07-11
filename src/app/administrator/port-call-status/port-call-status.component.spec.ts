import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortCallStatusComponent } from './port-call-status.component';

describe('PortCallStatusComponent', () => {
  let component: PortCallStatusComponent;
  let fixture: ComponentFixture<PortCallStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortCallStatusComponent]
    });
    fixture = TestBed.createComponent(PortCallStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
