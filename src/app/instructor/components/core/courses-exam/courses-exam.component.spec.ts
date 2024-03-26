import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesExamComponent } from './courses-exam.component';

describe('CoursesExamComponent', () => {
  let component: CoursesExamComponent;
  let fixture: ComponentFixture<CoursesExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesExamComponent]
    });
    fixture = TestBed.createComponent(CoursesExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
