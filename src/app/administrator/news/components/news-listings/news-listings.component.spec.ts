import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListingsComponent } from './news-listings.component';

describe('NewsListingsComponent', () => {
  let component: NewsListingsComponent;
  let fixture: ComponentFixture<NewsListingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsListingsComponent]
    });
    fixture = TestBed.createComponent(NewsListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
