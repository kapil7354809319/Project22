import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArchivedServicesComponent } from './view-archived-services.component';

describe('ViewArchivedServicesComponent', () => {
  let component: ViewArchivedServicesComponent;
  let fixture: ComponentFixture<ViewArchivedServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewArchivedServicesComponent]
    });
    fixture = TestBed.createComponent(ViewArchivedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
