import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuestion } from '../interface/iquestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseURL: string = 'http://localhost:5050/questions';

  constructor(private httpClient: HttpClient) {}

  getAllQuestions(): Observable<IQuestion[]> {
    return this.httpClient.get<IQuestion[]>(this.baseURL);
  }

  getQuestionById(id: number): Observable<IQuestion> {
    return this.httpClient.get<IQuestion>(`${this.baseURL}/${id}`);
  }

  addQuestion(questionData: IQuestion , examId :number): Observable<IQuestion> {
    return this.httpClient.post<IQuestion>(`${this.baseURL}/exams/${examId}`, questionData);
  }

  updateQuestion(id: number, question: IQuestion): Observable<IQuestion> {
    return this.httpClient.put<IQuestion>(`${this.baseURL}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`);
  }
}
