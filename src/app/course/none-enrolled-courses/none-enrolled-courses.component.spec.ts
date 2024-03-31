import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoneEnrolledCoursesComponent } from './none-enrolled-courses.component';

describe('NoneEnrolledCoursesComponent', () => {
  let component: NoneEnrolledCoursesComponent;
  let fixture: ComponentFixture<NoneEnrolledCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoneEnrolledCoursesComponent]
    });
    fixture = TestBed.createComponent(NoneEnrolledCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
