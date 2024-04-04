import { Time } from "@angular/common";
import { IQuestion } from "./iquestion";

export interface IExam {
  id: number;
  name: string;
  duration: number;
  time: string;
  date: Date;
  max_Degree: number;
  min_Degree: number;
  allQuestion: {
    id: number;
    question: string;
    questionType: string;
    correctAnswer: string;
    choosesName: string[];
  }[];
  course_ID: number;
  numberOfQuestions: number;
}
