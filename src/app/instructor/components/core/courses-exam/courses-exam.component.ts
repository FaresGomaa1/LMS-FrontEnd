import { CourseService } from './../../../service/course.service';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';
import { ICourse } from 'src/app/instructor/interface/i-course';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-courses-exam',
  templateUrl: './courses-exam.component.html',
  styleUrls: ['./courses-exam.component.scss']
})
export class CoursesExamComponent {
  
  @Input() courseId: number=0;
  exams!: IExam[] ;

  constructor(private route: ActivatedRoute, private examService: ExamService, 
    private dialog: MatDialog,
    private router: Router , private CourseService: CourseService) { }


    pagedExams: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;

  

  setPage(page: number): void {
    // Calculate start and end index of exams for the current page
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.exams.length - 1);

    // Slice the exams array to get exams for the current page
    this.pagedExams = this.exams.slice(startIndex, endIndex + 1);
    this.currentPage = page;
  }

  get totalPagesArray(): number[] {
    // Calculate total number of pages
    const totalPages = Math.ceil(this.exams.length / this.pageSize);

    // Generate an array containing page numbers
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  setCurrentPage(page: number): void {
    this.setPage(page);
  }

  ngOnInit(): void {
   // this.course_Id = this.route.snapshot.params['courseId'];
  
  //  console.log(this.course_Id);
    this.loadExams(); 
    this.setPage(1);
    this. loadCourse();
   
  }
course!: ICourse;
  loadCourse(): void {
    this.CourseService.getCourseById(this.courseId).subscribe(
      course => {
        this.course = course;
      },
      error => {
        console.error('Error fetching course:', error);
      }
    );
  }

  isCourseEnded(): boolean {
    if (!this.course) {
      return false; // Return false if course data is not loaded yet
    }
    const currentDateTime = new Date().getTime(); 
    const courseEndDateTime = new Date(this.course.end_Date).getTime();
    return currentDateTime > courseEndDateTime;
  }

  openPopupExam(examId: number) {
    const dialogRef = this.dialog.open(PopupComponent, {
        width: '400px',
        height: '230px',
        data: { id: examId, objectType: 'exam' },
    });

     dialogRef.componentInstance.itemDeleted.subscribe(() => {
      this.loadExams();
     });
}

  deleteExam(id: number) {
   this.openPopupExam(id);
  }
  
  
  loadExams() {
    this.examService.getExamsByCourseId(this.courseId).subscribe(
      exams => {
        this.exams = exams;
      },
      error => {
        console.error('Error fetching exams:', error);
      }
    );
  }
}
