import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import { CourseService } from 'src/app/instructor/service/course.service';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { IQuestion } from 'src/app/instructor/interface/iquestion';
import { IStudent } from 'src/app/instructor/interface/istudent';
import { QuestionService } from 'src/app/instructor/service/question.service';

@Component({
  selector: 'app-student-result',
  templateUrl: './student-result.component.html',
  styleUrls: ['./student-result.component.scss']
})
export class StudentResultComponent {

  exam_Id!: number;
  exams: IExam[] | undefined;
  questions! : IQuestion[]  ;
  currentDate: Date = new Date();
  students: IStudent[];
  constructor(private route: ActivatedRoute, private rou : Router, private examService: ExamService , 
    private CourseService : CourseService ,    private dialog: MatDialog
    ,private QuestionService : QuestionService) {
      this.students = [];
   //   this.isLargeScreen = window.innerWidth > 992; 
    }

//     isLargeScreen: boolean;


//  @HostListener('window:resize', ['$event'])
//  onResize(event:Event) {
//    // Update isLargeScreen when window is resized
//    this.isLargeScreen = window.innerWidth > 992; // Example breakpoint for large screen
//  }
  containsExamId(examIds: number[], examId: number): boolean {
    for (const id of examIds) {
      if (id == examId) {
        return true;
      }
    }
    return false;
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
  
    ngOnInit(): void {
    this.exam_Id = this.route.snapshot.params['examId'];
    console.log('Exam ID:', this.exam_Id); 
    
    this.loadStudentsResults(this.exam_Id);  
  }
  
  currentPage2: number = 1; 
studentsPerPage: number = 20; 

 
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
  
}
