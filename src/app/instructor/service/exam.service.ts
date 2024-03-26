import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IExam } from '../interface/i-exam';
import { IQuestion } from '../interface/iquestion';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
   baseURL: string = 'http://localhost:5050/Exam';

  constructor(private httpClient: HttpClient) {}

  getAllExams(): Observable<IExam[]> {
    return this.httpClient.get<IExam[]>(this.baseURL);
  }

  getExamById(id: number): Observable<IExam> {
    return this.httpClient.get<IExam>(`${this.baseURL}/${id}`);
  }

  addExam(examData: any) {
    return this.httpClient.post(this.baseURL, examData);
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
