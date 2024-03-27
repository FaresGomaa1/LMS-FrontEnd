import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from 'src/app/instructor/service/exam.service';
import { IExam } from 'src/app/instructor/interface/i-exam';

@Component({
  selector: 'app-courses-exam',
  templateUrl: './courses-exam.component.html',
  styleUrls: ['./courses-exam.component.scss']
})
export class CoursesExamComponent {
  course_Id: number=0;
  exams: IExam[] | undefined;

  constructor(private route: ActivatedRoute, private examService: ExamService) { }

  ngOnInit(): void {
    this.course_Id = this.route.snapshot.params['courseId'];
  
    console.log(this.course_Id);
    this.loadExams();
  }

  loadExams() {
    this.examService.getExamsByCourseId(this.course_Id).subscribe(
      exams => {
        this.exams = exams;
      },
      error => {
        console.error('Error fetching exams:', error);
      }
    );
  }


  deleteExam(DeleteExamId:number): void {
    if (!DeleteExamId) {
      console.error('Exam ID not found.');
      return;
    }
  
    const confirmDelete = window.confirm('Are you sure you want to delete this Exam?');
    if (!confirmDelete) {
      return; 
    }
  
    this.examService.deleteExam(DeleteExamId).subscribe(
      () => {
        alert('Exam deleted successfully.');
        this.loadExams();
      },
      error => {
        console.error('Failed to delete Exam:', error);
      }
    );
  }
}
