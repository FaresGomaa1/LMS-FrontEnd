import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-solve-exam',
  templateUrl: './solve-exam.component.html',
  styleUrls: ['./solve-exam.component.scss']
})
export class SolveExamComponent implements OnInit {
  examId: number | undefined;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getExamIdFromUrl();
  }

  getExamIdFromUrl(): void {
    this.route.params.subscribe(params => {
      this.examId = +params['id'];
    });
  }

  startExam() {
    if (this.examId) {
      this.router.navigate(['/startExam', this.examId]);
    }
  }
}