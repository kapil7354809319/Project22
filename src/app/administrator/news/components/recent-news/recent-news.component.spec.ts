import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNewsComponent } from './recent-news.component';

describe('RecentNewsComponent', () => {
  let component: RecentNewsComponent;
  let fixture: ComponentFixture<RecentNewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecentNewsComponent]
    });
    fixture = TestBed.createComponent(RecentNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
