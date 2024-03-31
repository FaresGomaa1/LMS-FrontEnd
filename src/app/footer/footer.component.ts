import { CourseService } from '../course/course.service';
import { Component } from '@angular/core';
import { ICourses } from '../course/icourses';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  allCourses: ICourses[]= []
  constructor(
    private courserService : CourseService
  ){
    this.courserService.getAllCourses().subscribe((courses)=>{
     for (let i = 0; i < 4; i++){
      this.allCourses.push(courses[i]);
     }
    })
  }

}
