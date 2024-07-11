import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRelayComponent } from './manage-relay.component';

describe('ManageRelayComponent', () => {
  let component: ManageRelayComponent;
  let fixture: ComponentFixture<ManageRelayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageRelayComponent]
    });
    fixture = TestBed.createComponent(ManageRelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
