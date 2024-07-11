import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTradeRouteComponent } from './manage-trade-route.component';

describe('ManageTradeRouteComponent', () => {
  let component: ManageTradeRouteComponent;
  let fixture: ComponentFixture<ManageTradeRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTradeRouteComponent]
    });
    fixture = TestBed.createComponent(ManageTradeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
