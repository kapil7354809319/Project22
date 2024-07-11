import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortToPortSearchComponent } from './port-to-port-search.component';

describe('PortToPortSearchComponent', () => {
  let component: PortToPortSearchComponent;
  let fixture: ComponentFixture<PortToPortSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortToPortSearchComponent]
    });
    fixture = TestBed.createComponent(PortToPortSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
