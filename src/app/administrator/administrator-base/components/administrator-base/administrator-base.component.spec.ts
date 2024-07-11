import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorBaseComponent } from './administrator-base.component';

describe('AdministratorBaseComponent', () => {
  let component: AdministratorBaseComponent;
  let fixture: ComponentFixture<AdministratorBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorBaseComponent]
    });
    fixture = TestBed.createComponent(AdministratorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
