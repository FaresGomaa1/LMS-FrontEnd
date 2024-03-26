import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IExam } from '../interface/i-exam';
import { IQuestion } from '../interface/iquestion';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseURL: string = 'http://localhost:5050/exams';

  constructor(private httpClient: HttpClient) {}

  getAllExams(): Observable<IExam[]> {
    return this.httpClient.get<IExam[]>(this.baseURL);
  }

  getExamById(id: number): Observable<IExam> {
    return this.httpClient.get<IExam>(`${this.baseURL}/${id}`);
  }

  addExam(courseId: number, examData: any): Observable<IExam> {
    return this.httpClient.post<IExam>(`${this.baseURL}/courses/${courseId}`, examData);
  }

  updateExam(id: number, exam: IExam): Observable<IExam> {
    return this.httpClient.put<IExam>(`${this.baseURL}/${id}`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }

  
}
