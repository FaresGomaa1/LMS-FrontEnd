export interface IStudent {
    id: number;
    name: string;
    age: number;
    title: string;
    phone: string;
    address: string;
    email: string;
    ssn:string;
    userAttachmentPath?:string;
    password: string;
    imageFile:File;
    courseName: string[];
    instructorIDs: number[];
    courseIDs?:number[]
    examName?: string[];
    examIDs?: number[];
    results?:number[]
}
