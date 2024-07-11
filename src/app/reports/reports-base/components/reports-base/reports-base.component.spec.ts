import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsBaseComponent } from './reports-base.component';

describe('ReportsBaseComponent', () => {
  let component: ReportsBaseComponent;
  let fixture: ComponentFixture<ReportsBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsBaseComponent]
    });
    fixture = TestBed.createComponent(ReportsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
