import { CourseService } from 'src/app/instructor/service/course.service';

import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from '../../interface/i-exam';
import { IQuestion } from '../../interface/iquestion';
import { IStudent } from '../../interface/istudent';
import { map, tap } from 'rxjs';
import { PopupComponent } from '../core/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-exam-questions',
  templateUrl: './view-exam-questions.component.html',
  styleUrls: ['./view-exam-questions.component.scss']
})
export class ViewExamQuestionsComponent {
  exam_Id!: number;
  exams: IExam[] | undefined;
  questions! : IQuestion[]  ;
  currentDate: Date = new Date();
  students: IStudent[];
  constructor(private route: ActivatedRoute, private rou : Router, private examService: ExamService , 
    private CourseService : CourseService ,    private dialog: MatDialog
    ,private QuestionService : QuestionService) {
      this.students = [];
     }
  
  isExamDatePassed(): boolean {
    return this.exam.date < new Date(); 
  }  
  ngOnInit(): void {
    this.exam_Id = this.route.snapshot.params['examId'];
    console.log('Exam ID:', this.exam_Id); 
    this.loadExam();
    this.loadQuestions();
    this.loadStudentsResults(this.exam_Id);  
  }
  
  openPopupExam(examId: number, course_ID: number ) {
    const dialogRef = this.dialog.open(PopupComponent, {
        width: '400px',
        height: '230px',
        data: { id: examId, objectType: 'exam' },
    });

     dialogRef.componentInstance.itemDeleted.subscribe(() => {
      this.rou.navigate(['/instructor/shared/courseDetails',course_ID ]);
     });
}
 
  deleteExam(id: number, course_ID: number) {
    this.openPopupExam(id, course_ID);
  }
  
  getMaxChoices(): number[] {
    let maxChoices = 0;
    for (const question of this.questions) {
      if (question.choosesName.length > maxChoices) {
        maxChoices = question.choosesName.length;
      }
    }
    return Array(maxChoices).fill(0).map((x, i) => i + 1);
  }

  Edit(id: number){
    this.rou.navigate(['/instructor/shared/editQuestions', id]);

  }

  AddQuestion(id: number){
    this.rou.navigate(['/instructor/shared/addNewQuestion', id]);

  }
    exam!: IExam;
  loadExam() {
    this.examService.getExamById(this.exam_Id).subscribe(
      exams => {
        this.exam = exams;
      },
      error => {
        console.error('Error fetching exams:', error);
      }
    );

    
  }

  containsExamId(examIds: number[], examId: number): boolean {
    for (const id of examIds) {
      if (id == examId) {
        return true;
      }
    }
    return false;
  }

 
  currentPage = 1;
  pageSize = 7; // Number of questions per page

   
  getPaginatedQuestions(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.questions.slice(startIndex, endIndex);
  }

   
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  
  nextPage() {
    const totalPages = Math.ceil(this.questions.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  // Function to check if there's a previous page
  hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  
  hasNextPage(): boolean {
    const totalPages = Math.ceil(this.questions.length / this.pageSize);
    return this.currentPage < totalPages;
  }

  openPopupQuestion(questionId: number) {
    const dialogRef = this.dialog.open(PopupComponent, {
        width: '400px',
        height: '230px',
        data: { id: questionId, objectType: 'question' },
    });

     dialogRef.componentInstance.itemDeleted.subscribe(() => {
      this.loadQuestions();
     });
}

  loadStudentsResults(examId: number) {
    console.log('Exam ID:', examId);  
   
    this.CourseService.getAllStudents().subscribe(
      allStudents => {
        console.log('All Students:', allStudents);
   
        const filteredStudents: IStudent[] = [];
   
        for (const student of allStudents) {
          if (student.examIDs && this.containsExamId(student.examIDs, examId)) {
           
            filteredStudents.push(student);
          }
        }
   
        this.students = filteredStudents;
      },
      error => {
        console.error('Error fetching students:', error);
      }
    );
  }
  
  
  
  currentPage2: number = 1; 
studentsPerPage: number = 7; 

 
getStartIndex(): number {
  return (this.currentPage2 - 1) * this.studentsPerPage + 1;
}

 
getEndIndex(): number {
  return Math.min(this.currentPage2 * this.studentsPerPage, this.students.length);
}

 
getPaginatedStudents(): any[] {
  const startIndex = (this.currentPage2 - 1) * this.studentsPerPage;
  const endIndex = startIndex + this.studentsPerPage;
  return this.students.slice(startIndex, endIndex);
}

 
hasPrevPage2(): boolean {
  return this.currentPage2 > 1;
}

 
hasNextPage2(): boolean {
  return this.currentPage2 < Math.ceil(this.students.length / this.studentsPerPage);
}

 
prevPage2(): void {
  if (this.hasPrevPage()) {
    this.currentPage2--;
  }
}

 
nextPage2(): void {
  if (this.hasNextPage()) {
    this.currentPage2++;
  }
}
  

  getEmptyCells(count: number): any[] {
    return Array(count).fill(null);
  }
  deleteQuestion(id: number) {


    this.openPopupQuestion(id) 
  }
  

  loadQuestions() {
    this.QuestionService.getQuestionbyExamId(this.exam_Id).subscribe(
      questions => {
        this.questions = questions;
      },
      error => {
        console.error('Error fetching questions:', error);
      }
    );
  }
}
