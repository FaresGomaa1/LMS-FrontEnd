import { Injectable } from '@angular/core';
import { IQuestion } from '../interface/iquestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionInExamService {
  private selectedQuestions: IQuestion[] = [];
  constructor() {}

  setSelectedQuestions(questions: IQuestion[]) {
      this.selectedQuestions = questions;
      console.log(this.selectedQuestions)
  }

  getSelectedQuestions(): IQuestion[] {
      return this.selectedQuestions;
  }
}
