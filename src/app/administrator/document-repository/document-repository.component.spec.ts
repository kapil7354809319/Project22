import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRepositoryComponent } from './document-repository.component';

describe('DocumentRepositoryComponent', () => {
  let component: DocumentRepositoryComponent;
  let fixture: ComponentFixture<DocumentRepositoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentRepositoryComponent]
    });
    fixture = TestBed.createComponent(DocumentRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
