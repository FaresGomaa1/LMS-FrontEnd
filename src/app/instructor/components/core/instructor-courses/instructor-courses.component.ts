import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { InstructorCourseService } from 'src/app/instructor/service/instructor-course.service';
import { InstructorService } from 'src/app/instructor/service/instructor.service';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.scss']
})
export class InstructorCoursesComponent implements OnInit {
  instructorCourses: ICourse[] | undefined;
  
  tokenKey = 'auth_token';
  userId: number = 0;
  public instructor: IInstructor | undefined;

  constructor(private instructorcourseService: InstructorCourseService ) { }

 
  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;
    }
    this.loadInstructorCourses();
  }
  sortByEndDateDesc: boolean = true;
  isCourseEnded(endDate: Date): boolean { 
    const endDateTime = new Date(endDate).getTime(); 
    const currentDateTime = new Date().getTime(); 
    return currentDateTime > endDateTime;
  }


  toggleSortOrder() {
    this.sortByEndDateDesc = !this.sortByEndDateDesc;
    // Reload courses to reflect the new sorting order
    this.loadInstructorCourses();
  }

  sortCourses(courses: ICourse[]): ICourse[] {
    if (this.sortByEndDateDesc) {
      // Sort courses by end date in descending order (newest first)
      return courses.sort((a, b) => new Date(b.end_Date).getTime() - new Date(a.end_Date).getTime());
    } else {
      // Sort courses by end date in ascending order (oldest first)
      return courses.sort((a, b) => new Date(a.end_Date).getTime() - new Date(b.end_Date).getTime());
    }
  }

  
  loadInstructorCourses() {
    this.instructorcourseService.getInstructorCourses(this.userId).subscribe(
      courses => {
        this.instructorCourses = courses;
        
        this.instructorCourses = this.sortCourses(courses);
        console.log(this.instructorCourses);
      },
      error => {
        console.log("erroorrr");
      }
    );
  }
}
