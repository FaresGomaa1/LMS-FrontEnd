import { CourseService } from 'src/app/instructor/service/course.service';

import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from '../../interface/i-exam';
import { IQuestion } from '../../interface/iquestion';
import { IStudent } from '../../interface/istudent';
import { map, tap } from 'rxjs';

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
    private CourseService : CourseService
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
  
  
 
  deleteExam(id: number, course_ID: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(id)
        .subscribe(() => {
          console.log(`Exam with ID ${id} deleted successfully.`);
           this.rou.navigate(['/instructor/shared/courseDetails', course_ID]);
        }, error => {
          console.error('Error deleting exam:', error);
        });
    }
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
  
  
  
  
  

  getEmptyCells(count: number): any[] {
    return Array(count).fill(null);
  }
  deleteQuestion(id: number) {
    if (confirm('Are you sure you want to delete this question?')) {
      this.QuestionService.deleteQuestion(id)
        .subscribe(() => {
          console.log(`Question with ID ${id} deleted successfully.`);
          // Refresh the list of questions after deletion
          this.loadQuestions();
        }, error => {
          console.error('Error deleting question:', error);
        });
    }}
  

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
