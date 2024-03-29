import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';

@Component({
  selector: 'app-courses-exam',
  templateUrl: './courses-exam.component.html',
  styleUrls: ['./courses-exam.component.scss']
})
export class CoursesExamComponent {
  
  @Input() courseId: number=0;
  exams: IExam[] | undefined;

  constructor(private route: ActivatedRoute, private examService: ExamService, private router: Router) { }

  ngOnInit(): void {
   // this.course_Id = this.route.snapshot.params['courseId'];
  
  //  console.log(this.course_Id);
    this.loadExams();
  }

  deleteExam(id: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(id)
        .subscribe(() => {
          console.log(`Exam with ID ${id} deleted successfully.`);
          // Reload exams data after deletion
          this.loadExams();
        }, error => {
          console.error('Error deleting exam:', error);
        });
    }
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
