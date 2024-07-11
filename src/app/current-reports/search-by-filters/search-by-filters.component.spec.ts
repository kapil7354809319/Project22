import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByFiltersComponent } from './search-by-filters.component';

describe('SearchByFiltersComponent', () => {
  let component: SearchByFiltersComponent;
  let fixture: ComponentFixture<SearchByFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchByFiltersComponent]
    });
    fixture = TestBed.createComponent(SearchByFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
