import { StudentService } from './../../generalServices/student.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudent } from '../../Interfaces/istudent';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss'],
})
export class StudentEditComponent implements OnInit {
  studentId!: number;
  studentInfo!: IStudent;
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.getStudentId();
  }
  getStudentId() {
    this.route.paramMap.subscribe((params) => {
      const idString = params.get('id');
      if (idString !== null) {
        // Parse the student ID as a number
        this.studentId = parseInt(idString, 10);
        console.log('Student ID:', this.studentId);
      } else {
        // Handle the case when 'id' parameter is null
        console.error('Student ID is null');
      }
    });
  }
  getStudentById() {
    this.studentService.getStudentById(this.studentId).subscribe((std)=>{
      this.studentInfo = std
    })
  }
  // Submit(){
  //   this.studentService.Edit()
  // }
}
