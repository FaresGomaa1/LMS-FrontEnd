import { CourseService } from 'src/app/instructor/service/course.service';

import { QuestionService } from 'src/app/instructor/service/question.service';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from '../../interface/i-exam';
import { IQuestion } from '../../interface/iquestion';
import { IStudent } from '../../interface/istudent';
import { map, tap } from 'rxjs';
import { PopupComponent } from '../core/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
      this.isLargeScreen = window.innerWidth > 992; 
     }

     isLargeScreen: boolean;
 

  @HostListener('window:resize', ['$event'])
  onResize(event:Event) {
    // Update isLargeScreen when window is resized
    this.isLargeScreen = window.innerWidth > 992; // Example breakpoint for large screen
  }
  
     generatePDF() {
      const element = document.getElementById('contentToConvert');
        
      if (!element) {
        console.error("Element with id 'contentToConvert' not found.");
        return;
      }
      
      
      html2canvas(element, { scrollY: -window.scrollY }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
      
        const imgWidth = 210; // A4 size
        const pageHeight = 295; // A4 size
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
      
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      
        const totalPages = Math.ceil(element.scrollHeight / pageHeight);
      
        // Loop through each page of the exam questions
        for (let i = 1; i < totalPages; i++) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        }
      
        pdf.save('Exam.pdf');
      });
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
  pageSize = 20; // Number of questions per page

   
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


generatePDFResults() {
  const element = document.getElementById('contentToConvertResult') ;

  if (!element) {
    console.error("Element with id 'contentToConvert' not found.");
    return;
  }
  
  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF();

    const imgWidth = 210; // A4 size
    const pageHeight = 295; // A4 size
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('Results.pdf');
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
  if (this.hasPrevPage2()) {
    this.currentPage2--;
  }
}

 
nextPage2(): void {
  if (this.hasNextPage2()) {
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
