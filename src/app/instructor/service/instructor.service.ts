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
    
    // Convert URL to file and update instructor imageFile
    const fileName = 'image.jpg'; // You can change the filename as needed
    return this.imageService.urlToFile(instructor.userAttachmentPath!, fileName).pipe(
      switchMap(file => {
        // Assign the File object to the instructor's imageFile property
        instructor.imageFile = file;
  
        // Perform the HTTP PUT request to update the instructor
        return this.HttpClient.put(url, instructor);
      })
    );
  }
  
  // Method to add a course to an instructor
  addCourseToInstructor(instructorId: number, courseName: string): Observable<any> {
    return this.getById(instructorId).pipe( 
      switchMap((instructor: IInstructor) => { 
        console.log(instructor);
        
        instructor.courseName.push(courseName);  
        return this.updateInstructor(instructor);
      })
    );
  }

  // addCourseToInstructor(instructorId: number, course: ICourse): Observable<IInstructor> {
  //   return this.HttpClient.post<IInstructor>(`${this.baseURL}/${instructorId}/Courses`, course);
  // }

  // updateInstructorCourses(instructorId: number, courseName: string): Observable<IInstructor> {
  //   return this.getById(instructorId).pipe(
  //     switchMap((instructor: IInstructor) => {
  //       instructor.courseName.push(courseName); 
  //       return this.Updates(instructorId, instructor);  
  //     })
  //   );
  // }

 
}