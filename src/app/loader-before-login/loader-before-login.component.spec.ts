import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderBeforeLoginComponent } from './loader-before-login.component';

describe('LoaderBeforeLoginComponent', () => {
  let component: LoaderBeforeLoginComponent;
  let fixture: ComponentFixture<LoaderBeforeLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderBeforeLoginComponent]
    });
    fixture = TestBed.createComponent(LoaderBeforeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
