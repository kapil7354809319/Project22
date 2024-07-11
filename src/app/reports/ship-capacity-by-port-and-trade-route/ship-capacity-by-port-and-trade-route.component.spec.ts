import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipCapacityByPortAndTradeRouteComponent } from './ship-capacity-by-port-and-trade-route.component';

describe('ShipCapacityByPortAndTradeRouteComponent', () => {
  let component: ShipCapacityByPortAndTradeRouteComponent;
  let fixture: ComponentFixture<ShipCapacityByPortAndTradeRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipCapacityByPortAndTradeRouteComponent]
    });
    fixture = TestBed.createComponent(ShipCapacityByPortAndTradeRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
