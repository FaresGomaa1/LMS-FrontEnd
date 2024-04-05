import { Time } from "@angular/common";
import { IQuestion } from "./iquestion";

export interface IExam {
  id: number;
  name: string;
  max_Degree: number;
  min_Degree: number;
  duration: number;
  time: Time;
  date: Date;
  course_ID: number;
  courseName: string;
  allQuestion: {
      question: string;
      questionType: string;
      correctAnswer: string;
      choosesName: string[];
  }[];
  questionIDs: string[];
  numOfQuestions: number;
}
