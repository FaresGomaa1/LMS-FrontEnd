import { IInstructor } from 'src/app/instructor/interface/i-instructor';
import { InstructorService } from '../generalServices/instructor.service';
import { IStudent } from '../Interfaces/istudent';
import { StudentService } from '../generalServices/student.service';
import { ICourse } from '../instructor/interface/i-course';
import { CourserService } from './../generalServices/courser.service';
import { Component, OnInit } from '@angular/core';
import { ICourses } from '../exams/ICourses';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  allCourses: ICourse[] = [];
  allInstructors: IInstructor[] = [];
  
  constructor(private CourserService: CourserService,
    private studentService : StudentService,
    private InstructorService : InstructorService
    ) {}
  ngOnInit(): void {
    this.CourserService.getAllInstructors().subscribe((courses) => {
      for (let i = 0; i < 3; i++){
        this.allCourses.push(courses[i])
      }
    });
    this.InstructorService.getAllInstructors().subscribe((ins)=>{
      this.allInstructors = ins;
    })
  }
}
