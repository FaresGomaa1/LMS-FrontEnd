import { StudentService } from '../generalServices/student.service';
import { CourseService } from '../course/course.service';
import { InstructorService } from '../generalServices/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IInstructor } from '../Interfaces/instructor';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss'],
})
export class InstructorProfileComponent implements OnInit {
  tokenKey = 'auth_token';
  instructorId!: number;
  instructor!: IInstructor;
  instructorCourse: any[] = []
studentId!:number
  constructor(
    private route: ActivatedRoute,
    private instructorService: InstructorService,
    private courseService: CourseService,
    private studentService :StudentService,
    private router1: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.studentId = decodedToken.nameid;
    }
    this.getInstructorId();
  }
  getInstructorId() {
    const paramMap = this.route.snapshot.paramMap;
    if (paramMap) {
      const idString = paramMap.get('id');
      if (idString) {
        this.instructorId = +idString;
        this.instructorService
          .getInstructorById(this.instructorId)
          .subscribe((ins) => {
            this.instructor = ins;
            for(let i = 0; i < ins.courseIDs.length; i++){
              this.courseService.getCourseById(ins.courseIDs[i]).subscribe((course)=>{
                this.instructorCourse.push(course)
                console.log(this.instructorCourse)
              })
            }
          });
      } else {
        console.error('No id parameter found in URL');
      }
    } else {
      console.error('paramMap is null');
    }
  }

  checkEnrollment(courseId: number) {
    this.studentService.getStudentById(this.studentId).subscribe((std) => {
      // Use Array.prototype.some() to check if the courseId exists in std.courseIDs
      const isEnrolled = std.courseIDs.some((id) => id === courseId);
      
      if (isEnrolled) {
        // If enrolled, navigate to course details page
        this.router1.navigate(['/coursedetails', courseId]);
      } else {
        // If not enrolled, navigate to non-enrolled courses page
        this.router1.navigate(['/nonEnrolledCourses', courseId]);
      }
    });
  }
}
