import { ICourse } from "./i-course";

export interface IInstructor {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  photo?: string;
  specialization: string;
  courseName: string[];
}
