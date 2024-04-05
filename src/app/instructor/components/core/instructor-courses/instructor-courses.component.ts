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
  toggleDescription(course: ICourse) {
    course.showFullDescription = !course.showFullDescription;
    if (course.showFullDescription) {
      setTimeout(() => {
        this.scrollToEnd();
      }, 0); // Using setTimeout to ensure scrolling occurs after view updates
    }
  }

  scrollToEnd() {
    const element = document.getElementById('full-description');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }
  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;
    }
    console.log(this.userId)
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
    this.loadInstructorCourses();
  }

  sortCourses(courses: ICourse[]): ICourse[] {
    if (this.sortByEndDateDesc) { 
      return courses.sort((a, b) => new Date(b.end_Date).getTime() - new Date(a.end_Date).getTime());
    } else { 
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

  openMaterialtLink(course: ICourse): void {
 
      window.open(course.material, '_blank');
  
  }
}
