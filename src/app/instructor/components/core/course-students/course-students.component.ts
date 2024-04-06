import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudent } from 'src/app/instructor/interface/istudent';
import { CourseService } from 'src/app/instructor/service/course.service';

@Component({
  selector: 'app-course-students',
  templateUrl: './course-students.component.html',
  styleUrls: ['./course-students.component.scss']
})
export class CourseStudentsComponent {
  courseStudents: IStudent[] = [];
  courseId!: number; 

  constructor(private studentService: CourseService , private act : ActivatedRoute) { }

  ngOnInit(): void {
    this.courseId = this.act.snapshot.params['courseId'];
    console.log(this.courseId);

    this.getCourseStudents(this.courseId);
  }

  getCourseStudents(id: number): void {
    console.log(id);
    (id);
    this.studentService.getStudentsByCourseId(id) // Pass the id parameter here
      .subscribe(
        students => {
          this.courseStudents = students;
        },
        error => {
          console.error('Error fetching course students:', error);
        }
      );
  }
}
