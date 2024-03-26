import { Component, OnInit } from '@angular/core';
import { StudentService } from '../generalServices/student.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IStudent } from '../Interfaces/istudent';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  tokenKey = 'auth_token';
  student: IStudent | undefined;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getStudentById();
  }

  getStudentById(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const userId = decodedToken.nameid;
      if (userId) {
        this.studentService.getStudentById(userId).subscribe(
          (student: IStudent) => {
            this.student = student;
          }
        );
      }
    }
  }
}