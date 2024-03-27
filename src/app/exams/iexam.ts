export interface IExam {
  id: number;
  name: string;
  duration: string;
  date: Date;
  max_Degree: number;
  min_Degree: number;
  studentIDs: number[];
  course_ID: number;
  numberOfQuestions: number;
}
