import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentReportsBaseComponent } from './current-reports-base.component';

describe('CurrentReportsBaseComponent', () => {
  let component: CurrentReportsBaseComponent;
  let fixture: ComponentFixture<CurrentReportsBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentReportsBaseComponent]
    });
    fixture = TestBed.createComponent(CurrentReportsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
