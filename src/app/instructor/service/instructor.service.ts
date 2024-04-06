import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ICourse } from '../interface/i-course';
import { IInstructor } from '../interface/i-instructor'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { ICourses } from 'src/app/exams/ICourses';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ImageFileService } from './image-file.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorService implements OnInit {
  baseURL :string = 'http://localhost:5050/Instructor';
 
  tokenKey = 'auth_token';
  userId: number = 0;
  constructor(private HttpClient :HttpClient , private imageService: ImageFileService) { }
  ngOnInit(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      this.userId = decodedToken.nameid;

  }}

  addCourseToInstructor(id: number = this.userId, courseid: number): Observable<any> {
    const url = 'http://localhost:5050/Instructor/addCourse';
    const payload = {
      instructorId: id,
      courseIDs: [courseid]
    };
    
    return this.HttpClient.post(url, payload);
  }

  getCurrentInstructorId(): number{
    return this.userId;
  }

  getAllData(): Observable<IInstructor[]> {
    return this.HttpClient.get<IInstructor[]>(this.baseURL);
  }

  getById(id: number): Observable<IInstructor> {
    return this.HttpClient.get<IInstructor>(`${this.baseURL}/${id}`);
  }
  Update(id: number,instructor:FormData ): Observable<IInstructor> {
    return this.HttpClient.put<IInstructor>(`${this.baseURL}/${id}`, instructor);
  }

 
  updateInstructor(instructor: IInstructor): Observable<any> {
    const url = `${this.baseURL}/${instructor.id}`;
     
    const fileName = 'image.jpg';  
    return this.imageService.urlToFile(instructor.userAttachmentPath!, fileName).pipe(
      switchMap(file => { 
        instructor.imageFile = file;
   
        return this.HttpClient.put(url, instructor);
      })
    );
  }
  
 
 

 
}