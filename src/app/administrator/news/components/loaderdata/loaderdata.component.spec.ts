import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderdataComponent } from './loaderdata.component';

describe('LoaderdataComponent', () => {
  let component: LoaderdataComponent;
  let fixture: ComponentFixture<LoaderdataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderdataComponent]
    });
    fixture = TestBed.createComponent(LoaderdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
