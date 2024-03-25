import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { InstructorCourseService } from 'src/app/instructor/service/instructor-course.service';
import { InstructorService } from 'src/app/instructor/service/instructor.service';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.scss']
})
export class InstructorCoursesComponent implements OnInit {
  instructorCourses: ICourse[] | undefined;

  constructor(private instructorcourseService: InstructorCourseService ) { }

  ngOnInit(): void {
    this.loadInstructorCourses();
  }

  loadInstructorCourses() {
    this.instructorcourseService.getInstructorCourses().subscribe(
      courses => {
        this.instructorCourses = courses;
        console.log(this.instructorCourses);
      },
      error => {
        console.log("erroorrr");
      }
    );
  }
}
