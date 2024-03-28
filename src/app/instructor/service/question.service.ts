import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IQuestion } from '../interface/iquestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseURL: string = 'http://localhost:5050/Question';

  constructor(private httpClient: HttpClient) {}

  getAllQuestions(): Observable<IQuestion[]> {
    return this.httpClient.get<IQuestion[]>(this.baseURL);
  }

  getQuestionById(id: number): Observable<IQuestion> {
    return this.httpClient.get<IQuestion>(`${this.baseURL}/${id}`);
  }

  addQuestion(questionData: IQuestion , examId :number): Observable<IQuestion> {
    return this.httpClient.post<IQuestion>(`${this.baseURL}`, questionData);
  }

  updateQuestion(id: number, question: IQuestion): Observable<IQuestion> {
    return this.httpClient.put<IQuestion>(`${this.baseURL}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }

  getQuestionbyExamId(examId: number): Observable<IQuestion[]> {
    return this.httpClient.get<IQuestion[]>(this.baseURL).pipe(
      map((question: IQuestion[]) => question.filter(que => que.exam_ID == examId))
    );
  }
}
