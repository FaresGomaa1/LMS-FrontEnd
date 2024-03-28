import { InstructorService } from '../generalServices/instructor.service';
import { IStudent } from '../Interfaces/istudent';
import { StudentService } from '../generalServices/student.service';
import { ICourse } from '../instructor/interface/i-course';
import { CourserService } from './../generalServices/courser.service';
import { Component, OnInit } from '@angular/core';
import { IInstructor } from '../instructor/interface/i-instructor';

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
      this.allCourses = courses;
    });
    this.InstructorService.getAllInstructors().subscribe((ins)=>{
      this.allInstructors = ins;
    })
  }
}
