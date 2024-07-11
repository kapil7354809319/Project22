import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLogListComponent } from './service-log-list.component';

describe('ServiceLogListComponent', () => {
  let component: ServiceLogListComponent;
  let fixture: ComponentFixture<ServiceLogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceLogListComponent]
    });
    fixture = TestBed.createComponent(ServiceLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
