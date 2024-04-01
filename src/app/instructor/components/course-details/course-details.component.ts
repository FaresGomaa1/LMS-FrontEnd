import { InstructorService } from '../../service/instructor.service';
import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../interface/i-course';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from 'src/app/instructor/service/course.service';
import { InstructorCourseService } from '../../service/instructor-course.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course!: ICourse ;
  courseName!:string;
  courseId: number = 0;
  showExams: boolean = false;
  numberOfStudents: number = 0;
  instructorId!: number;
  numberOfStudentsEnrolled : number=0
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private instructorCourseService: InstructorCourseService,
    private instructorService: InstructorService,
    private router: Router
  ) { }

  tokenKey = 'auth_token';
  userId: number = 0;
  toggleExams() {
   
    this.showExams = !this.showExams;
  }

  openMaterialtLink(course: ICourse): void {
 
    window.open(course.material, '_blank');

}ngOnInit(): void {
  const token = localStorage.getItem(this.tokenKey);
  if (token) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.userId = decodedToken.nameid;
  }

  this.route.paramMap.subscribe(params => {
    this.courseId = +params.get('courseId')!;
    if (this.courseId) {
      this.loadCourseDetails();
    } else {
      console.error('Course ID is missing from route parameters');
    }
  });
}

loadCourseDetails() {
  this.courseService.getCourseById(this.courseId).subscribe(
    course => {
      this.course = course;
      this.courseName = course.name;

      // Call getCourseEnrolledStudentsCount after courseName is assigned
      this.getCourseEnrolledStudentsCount();
      
      // Check if course belongs to the instructor
      this.instructorCourseService.isInstructorCourse(this.userId, this.course?.name || '').subscribe(isInstructorCourse => {
        if (!isInstructorCourse) {
          this.router.navigate(['instructor/shared/notfound']); 
        }
      });
    },
    error => {
      console.error('Failed to load course details:', error);
    }
  );
}

getCourseEnrolledStudentsCount(): void {
  this.courseService.getCourseEnrolledStudentsCount(this.courseName).subscribe(
    count => {
      console.log('Enrolled students count:', count);
      this.numberOfStudentsEnrolled = count;
    },
    error => {
      console.error('Error getting enrolled students count:', error);
    }
  );
}
}
