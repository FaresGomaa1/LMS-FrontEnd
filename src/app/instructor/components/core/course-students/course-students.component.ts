import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStudent } from 'src/app/instructor/interface/istudent';
import { CourseService } from 'src/app/instructor/service/course.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-course-students',
  templateUrl: './course-students.component.html',
  styleUrls: ['./course-students.component.scss']
})
export class CourseStudentsComponent {
  courseStudents: IStudent[] = [];
  courseId!: number; 

  constructor(private studentService: CourseService , private act : ActivatedRoute) {   
     this.isLargeScreen = window.innerWidth > 900; 
  }

  isLargeScreen: boolean;


@HostListener('window:resize', ['$event'])
onResize(event:Event) {
 
 this.isLargeScreen = window.innerWidth > 900;  
}
  generatePDF() {
    const element = document.getElementById('contentToConvert') ;
  
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
  
      pdf.save('students.pdf');
    });
  }
  
  ngOnInit(): void {
    this.courseId = this.act.snapshot.params['courseId'];
    console.log(this.courseId);

    this.getCourseStudents(this.courseId);
  }
 
  currentPage: number = 1;
  studentsPerPage: number = 20;

  get paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    const endIndex = startIndex + this.studentsPerPage;
    return this.courseStudents.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.hasPrevPage()) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage++;
    }
  }

  hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < Math.ceil(this.courseStudents.length / this.studentsPerPage);
  }


  getCourseStudents(id: number): void {
    console.log(id);
    (id);
    this.studentService.getStudentsByCourseId(id) 
      .subscribe(
        students => {
          this.courseStudents = students;
        },
        error => {
          console.error('Error fetching course students:', error);
        }
      );
  }
}
