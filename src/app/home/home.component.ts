import { IInstructor } from '../Interfaces/instructor';
import { InstructorService } from '../generalServices/instructor.service';
import { IStudent } from '../Interfaces/istudent';
import { StudentService } from '../generalServices/student.service';
import { ICourse } from '../instructor/interface/i-course';
import { CourseService } from '../course/course.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../course/icourses';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  allCourses: ICourses[] = [];
  allInstructors: IInstructor[] = [];
  
  constructor(private courserService: CourseService,
    private studentService : StudentService,
    private InstructorService : InstructorService
    ) {}
  ngOnInit(): void {
    this.courserService.getAllCourses().subscribe((courses) => {
      for (let i = 0; i < 3; i++){
        this.allCourses.push(courses[i])
      }
    });
    this.InstructorService.getAllInstructors().subscribe((ins)=>{
      this.allInstructors = ins;
    })
  }
}
