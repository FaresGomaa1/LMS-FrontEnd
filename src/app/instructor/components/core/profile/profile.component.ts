import { HttpClient } from '@angular/common/http';
import { InstructorService } from 'src/app/instructor/service/instructor.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IInstructor } from 'src/app/instructor/interface/i-instructor';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  tokenKey = 'auth_token';
  userId: number = 0;
  public instructor: IInstructor | undefined;

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;

      this.instructorService.getById(this.userId).subscribe(
        (instructor: IInstructor) => {
          this.instructor = instructor;
        },
        (error: any) => {
          console.error('Failed to fetch instructor profile:', error);
        }
      );
    }
  }
}