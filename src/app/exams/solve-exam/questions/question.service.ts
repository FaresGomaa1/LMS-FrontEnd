import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from 'src/app/generalServices/error-handler.service';
import { Observable, catchError, retry } from 'rxjs';
import { IQuestion } from './iquestion';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  domainName: string = 'http://localhost:5050';

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getAllQuestions(): Observable<IQuestion[]> {
    return this.http
      .get<IQuestion[]>(`${this.domainName}/Question`)
      .pipe(retry(2), catchError(this.errorHandlerService.handleError));
  }

  addStudentResult(
    studentId: number,
    examId: number,
    result: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      studentID: studentId,
      examID: examId,
      result: result,
    };

    return this.http
      .post<any>(`${this.domainName}/Student/addResult`, body, {
        headers: headers,
      })
  }
}
