import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { IExam } from '../interface/i-exam';
import { IQuestion } from '../interface/iquestion';
import { ICourse } from '../interface/i-course';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
   baseURL: string = 'http://localhost:5050/Exam';
   courseURL: string = 'http://localhost:5050/Course';

  constructor(private httpClient: HttpClient) {}
  getAllExams(): Observable<IExam[]> {
    return this.httpClient.get<IExam[]>(this.baseURL);
  }

  getExamById(id: number): Observable<IExam> {
    return this.httpClient.get<IExam>(`${this.baseURL}/${id}`);
  }
  

  addExam(examData: any): Observable<number> {
    return this.httpClient.post<any>(this.baseURL, examData).pipe(
      map(response => response.id) 
    );
  }
  createExam(exam: any): Observable<IExam> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post<IExam>(this.baseURL, exam, { headers: headers });
  }
  // addExam(examData: IExam): Observable<IExam> {
  //   return this.httpClient.post<IExam>(this.baseURL, examData);
  // }

  getExamsByInstructorId(instructorId: number): Observable<IExam[]> {
    // Fetch courses associated with the instructor
    return this.httpClient.get<ICourse[]>(`${this.courseURL}?instructorId=${instructorId}`).pipe(
      switchMap(courses => {
        const courseIds = courses.map(course => course.id); 
        return this.httpClient.get<IExam[]>(this.baseURL).pipe(
          map((exams: IExam[]) => exams.filter(exam => courseIds.includes(exam.course_ID)))
        );
      })
    );
  }

  
  updateExam(id: number, exam: IExam): Observable<IExam> {
    return this.httpClient.put<IExam>(`${this.baseURL}/${id}`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }

  getExamsByCourseId(courseId: number): Observable<IExam[]> {
    return this.httpClient.get<IExam[]>(this.baseURL).pipe(
      map((exams: IExam[]) => exams.filter(exam => exam.course_ID == courseId))
    );
  }
}
