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
 
  currentPage: number = 1;
  studentsPerPage: number = 7;

  get paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    const endIndex = startIndex + this.studentsPerPage;
    return this.courseStudents.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.hasPrevPage()) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
  }

  hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < Math.ceil(this.courseStudents.length / this.studentsPerPage);
  }


  getCourseStudents(id: number): void {
    console.log(id);
    (id);
    this.studentService.getStudentsByCourseId(id) 
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
