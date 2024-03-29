import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../interface/i-course';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/instructor/service/course.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
course: ICourse |undefined;
courseId : number =0;
showExams: boolean = false;
numberOfStudents: number = 0;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    this.getCourseDetails();
    console.log(this.course)
  }
  toggleExams() {
    this.showExams = !this.showExams;
  }
  getCourseDetails() {
    this.courseId = +this.route.snapshot.params['courseId'];
    if (this.courseId) {
      this.courseService.getCourseById(this.courseId)
        .subscribe(course => {
          this.course = course;
        });
       
    } else { 
      console.error('Course ID is missing from route parameters');
    }
  }
}