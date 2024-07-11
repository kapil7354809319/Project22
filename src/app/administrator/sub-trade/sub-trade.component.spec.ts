import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTradeComponent } from './sub-trade.component';

describe('SubTradeComponent', () => {
  let component: SubTradeComponent;
  let fixture: ComponentFixture<SubTradeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubTradeComponent]
    });
    fixture = TestBed.createComponent(SubTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
