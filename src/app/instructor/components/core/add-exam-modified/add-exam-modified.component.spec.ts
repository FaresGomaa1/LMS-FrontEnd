import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamModifiedComponent } from './add-exam-modified.component';

describe('AddExamModifiedComponent', () => {
  let component: AddExamModifiedComponent;
  let fixture: ComponentFixture<AddExamModifiedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExamModifiedComponent]
    });
    fixture = TestBed.createComponent(AddExamModifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
