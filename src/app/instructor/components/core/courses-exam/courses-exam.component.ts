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
  exams: IExam[] | undefined;

  constructor(private route: ActivatedRoute, private examService: ExamService, 
    private dialog: MatDialog,
    private router: Router , private CourseService: CourseService) { }

  ngOnInit(): void {
   // this.course_Id = this.route.snapshot.params['courseId'];
  
  //  console.log(this.course_Id);
    this.loadExams();
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
