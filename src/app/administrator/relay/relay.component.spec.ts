import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelayComponent } from './relay.component';

describe('RelayComponent', () => {
  let component: RelayComponent;
  let fixture: ComponentFixture<RelayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelayComponent]
    });
    fixture = TestBed.createComponent(RelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
