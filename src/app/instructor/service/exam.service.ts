import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { IExam } from '../interface/i-exam';
import { IQuestion } from '../interface/iquestion';
import { ICourse } from '../interface/i-course';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
   baseURL: string = 'http://localhost:5050/Exam';
   courseURL: string = 'http://localhost:5050/Course';

   private exams: IExam[] = [];
  constructor(private httpClient: HttpClient) {}
  getAllExams(): Observable<IExam[]> {
    return this.httpClient.get<IExam[]>(this.baseURL).pipe(
      tap(exams => this.exams = exams) // Assign fetched exams to allExams property
    );
  }


  getExamById(id: number): Observable<IExam> {
    return this.httpClient.get<IExam>(`${this.baseURL}/${id}`);
  }
 

 

  addExam(examData: IExam): Observable<IExam> {
    return this.httpClient.post<IExam>(this.baseURL, examData);
  }

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
  baseURL2: string = 'http://localhost:5050/Question';  

  
  updateExam(id: number, exam: IExam): Observable<IExam> { 

    const { allQuestion, ...examWithoutQuestions } = exam;
   console.log(examWithoutQuestions);
   
    return this.httpClient.put<IExam>(`${this.baseURL}/${id}`, {
      ...examWithoutQuestions,
      allQuestion: []
    });
  }

 
  updateExamWithQuestions(id: number, exam: IExam, newQuestion: any): Observable<IExam> {
    const { allQuestion, ...examWithoutQuestions } = exam;
  
   
    const updatedQuestions = [
      {
        question: newQuestion.question,
        questionType: newQuestion.questionType,
        correctAnswer: newQuestion.correctAnswer,
        choosesName: newQuestion.choosesName  
      }
    ];
  
    return this.httpClient.put<IExam>(`${this.baseURL}/${id}`, {
      ...examWithoutQuestions,
      allQuestion: updatedQuestions
    });
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
