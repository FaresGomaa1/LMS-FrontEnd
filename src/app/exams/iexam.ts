export interface IExam {
  id: number;
  name: string;
  duration: number;
  date: Date;
  courseIds: number[];
  degree: number;
}
