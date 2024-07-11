import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrewryUserComponent } from './drewry-user.component';

describe('DrewryUserComponent', () => {
  let component: DrewryUserComponent;
  let fixture: ComponentFixture<DrewryUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrewryUserComponent]
    });
    fixture = TestBed.createComponent(DrewryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
