import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByServiceComponent } from './search-by-service.component';

describe('SearchByServiceComponent', () => {
  let component: SearchByServiceComponent;
  let fixture: ComponentFixture<SearchByServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchByServiceComponent]
    });
    fixture = TestBed.createComponent(SearchByServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
