import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveBaseComponent } from './archive-base.component';

describe('ArchiveBaseComponent', () => {
  let component: ArchiveBaseComponent;
  let fixture: ComponentFixture<ArchiveBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchiveBaseComponent]
    });
    fixture = TestBed.createComponent(ArchiveBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
