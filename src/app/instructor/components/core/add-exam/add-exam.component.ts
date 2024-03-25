import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ExamService } from "src/app/instructor/service/exam.service";
import { IExam } from "src/app/instructor/interface/i-exam";

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html'
})
export class AddExamComponent implements OnInit {
  courseId: number | null = null;
  numberOfQuestions: number = 0;
  showAddQuestionTabs: boolean = false;
  examData: IExam = {
    id: 0,
    name: '',
    duration: 0,
    date: new Date(),
    course_ID: 0,
    max_Degree: 0,
    min_Degree: 0,
    studentIDs: [],
    numberOfQuestions: 0,
    questions: []
  };
  questionIndices: number[] = [];
  currentQuestionIndex: number = 0;
  selectedQuestionIndex: number | null = null;
  examAdded: boolean = false;

  constructor(private route: ActivatedRoute, private examService: ExamService) { }

  ngOnInit(): void {
    this.initializeCourseId();
    this.initializeExamData();
  }

  private initializeCourseId(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    if (courseIdParam !== null) {
      this.courseId = +courseIdParam;
    } else {
      console.error('Course ID is null.');
    }
  }

  private initializeExamData(): void {
    this.examData.course_ID = this.courseId || 0;
  }

  addExam() {
    if (!this.courseId) {
      console.error('Course ID is null.');
      return;
    }

    if (this.numberOfQuestions <= 0) {
      console.error('Number of questions should be greater than zero.');
      return;
    }

    // Validate other exam data here if necessary

    this.examData.numberOfQuestions = this.numberOfQuestions;

    this.examService.addExam(this.courseId, this.examData)
      .subscribe((result) => {
        console.log('Exam added successfully:', result);
        this.examAdded = true;
        // Reset form here if necessary
      }, error => {
        console.error('Failed to add exam:', error);
        // Handle error
      });
  }

  updateQuestionTabs() {
    if (this.numberOfQuestions > 0) {
      this.questionIndices = Array.from({ length: this.numberOfQuestions }, (_, i) => i);
      this.examData.questions = new Array(this.numberOfQuestions).fill({ id: 0, question: '', questionType: '', correctAnswer: '', exam_ID: 0 });
      this.currentQuestionIndex = 0;
      this.showAddQuestionTabs = true; // Set showAddQuestionTabs to true
    } else {
      this.showAddQuestionTabs = false; // Set showAddQuestionTabs to false if no questions
    }
  }
  

  selectQuestionTab(questionIndex: number) {
    this.selectedQuestionIndex = questionIndex;
  }
}
