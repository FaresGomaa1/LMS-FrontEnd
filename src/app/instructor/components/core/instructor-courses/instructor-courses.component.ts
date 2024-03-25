import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { InstructorService } from 'src/app/instructor/service/instructor.service';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.scss']
})
export class InstructorCoursesComponent implements OnInit {
  instructorCourses: ICourse[] | undefined; // Remove Observable<>

  constructor(private instructorService: InstructorService) { }

  ngOnInit(): void {
    this.loadInstructorCourses();
    console.log(this.instructorCourses);

  }

  loadInstructorCourses() {
    this.instructorCourses = this.instructorService.getInstructorCourses();
  }
}
