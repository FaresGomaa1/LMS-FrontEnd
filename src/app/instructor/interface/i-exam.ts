import { Time } from "@angular/common";
import { IQuestion } from "./iquestion";

export interface IExam {
  id: number;
  name: string;
  duration: number;
  time:string;
  date: Date;
  max_Degree: number;
  min_Degree: number; 
  numberOfQuestions: number;
  course_ID:number;
  allQuestion:string [];
  courseName:string;
  studentExam?:[]
}
