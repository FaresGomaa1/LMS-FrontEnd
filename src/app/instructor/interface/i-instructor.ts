import { ICourse } from "./i-course";

export interface IInstructor {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  //photo:string;
  password: string;
  userAttachmentPath?: string;
  imageFile:File;
  specialization: string;
  courseName: string[];
  experience: string,
  ssn:string,
  courseIDs:number[]
}
