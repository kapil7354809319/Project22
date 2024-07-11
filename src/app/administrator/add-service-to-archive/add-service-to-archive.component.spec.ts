import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceToArchiveComponent } from './add-service-to-archive.component';

describe('AddServiceToArchiveComponent', () => {
  let component: AddServiceToArchiveComponent;
  let fixture: ComponentFixture<AddServiceToArchiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceToArchiveComponent]
    });
    fixture = TestBed.createComponent(AddServiceToArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
