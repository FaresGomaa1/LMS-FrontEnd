import { IQuestion } from "./iquestion";

export interface IExam {
  id: number;
  name: string;
  duration: number;
  date: Date;
  max_Degree: number;
  min_Degree: number;
  studentIDs?: number[]; 
  course_ID: number;
  numberOfQuestions: number;
  questions: IQuestion[];
}
